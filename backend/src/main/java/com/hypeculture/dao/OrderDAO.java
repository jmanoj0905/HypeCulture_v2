package com.hypeculture.dao;

import com.hypeculture.model.Order;
import com.hypeculture.model.OrderItem;
import com.hypeculture.util.DBConnection;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for the {@code orders} and {@code order_items} tables.
 *
 * Order creation is delegated entirely to the CreateOrder stored procedure
 * which handles stock validation, item insertion, and atomic commit in one
 * database round-trip. This DAO wraps the CALL and surfaces errors cleanly.
 */
public class OrderDAO {

    private final ListingDAO listingDAO = new ListingDAO();

    // ------------------------------------------------------------------
    // Create
    // ------------------------------------------------------------------

    /**
     * Creates an order from the customer's current cart via the CreateOrder
     * stored procedure.
     *
     * On success the returned Order is populated with the new order_id and
     * total_amount. On failure (empty cart, insufficient stock, DB error) an
     * {@link OrderCreationException} is thrown with the SP's error message.
     */
    public Order createOrder(int customerId,
                             String shippingAddress, String shippingCity,
                             String shippingState, String shippingZip,
                             Order.PaymentMethod paymentMethod) throws SQLException {

        String callSql  = "CALL CreateOrder(?, ?, ?, ?, ?, ?, @orderId, @total, @err)";
        String fetchSql = "SELECT @orderId AS order_id, @total AS total_amount, @err AS error_message";

        Connection conn      = null;
        PreparedStatement callStmt  = null;
        PreparedStatement fetchStmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();

            callStmt = conn.prepareStatement(callSql);
            callStmt.setInt(1, customerId);
            callStmt.setString(2, shippingAddress);
            callStmt.setString(3, shippingCity);
            callStmt.setString(4, shippingState);
            callStmt.setString(5, shippingZip);
            callStmt.setString(6, paymentMethod.name());
            callStmt.execute();

            fetchStmt = conn.prepareStatement(fetchSql);
            rs = fetchStmt.executeQuery();

            if (rs.next()) {
                String error = rs.getString("error_message");
                if (error != null) {
                    throw new OrderCreationException(error);
                }

                int        orderId     = rs.getInt("order_id");
                BigDecimal totalAmount = rs.getBigDecimal("total_amount");

                // Return a lightweight order stub — caller can call findById to get full detail
                Order order = new Order();
                order.setOrderId(orderId);
                order.setCustomerId(customerId);
                order.setShippingAddress(shippingAddress);
                order.setShippingCity(shippingCity);
                order.setShippingState(shippingState);
                order.setShippingZip(shippingZip);
                order.setPaymentMethod(paymentMethod);
                order.setTotalAmount(totalAmount);
                order.setStatus(Order.Status.PLACED);
                order.setCreatedAt(LocalDateTime.now());
                return order;
            }
            throw new OrderCreationException("No response from CreateOrder procedure");
        } finally {
            if (rs        != null) try { rs.close();        } catch (SQLException ignored) {}
            if (fetchStmt != null) try { fetchStmt.close(); } catch (SQLException ignored) {}
            if (callStmt  != null) try { callStmt.close();  } catch (SQLException ignored) {}
            DBConnection.close(conn);
        }
    }

    // ------------------------------------------------------------------
    // Read
    // ------------------------------------------------------------------

    /**
     * Returns the full order with all its items for a given order_id.
     * Returns {@code null} if not found.
     */
    public Order findById(int orderId) throws SQLException {
        String sql = """
                SELECT * FROM orders WHERE order_id = ? LIMIT 1
                """;
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, orderId);
            rs = stmt.executeQuery();
            if (!rs.next()) return null;
            Order order = mapOrderRow(rs);
            order.setItems(loadItems(orderId, conn));
            return order;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    /**
     * Returns all orders for a customer, newest first, each with its items.
     * Powers UC-07: View Order History.
     */
    public List<Order> findByCustomer(int customerId) throws SQLException {
        String sql = """
                SELECT * FROM orders
                 WHERE customer_id = ?
                 ORDER BY created_at DESC
                """;
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, customerId);
            rs = stmt.executeQuery();
            List<Order> orders = new ArrayList<>();
            while (rs.next()) {
                Order order = mapOrderRow(rs);
                order.setItems(loadItems(order.getOrderId(), conn));
                orders.add(order);
            }
            return orders;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    /**
     * Returns all orders that contain at least one listing belonging to the
     * given seller. Used by the seller dashboard to track their sales.
     */
    public List<Order> findBySeller(int sellerId) throws SQLException {
        String sql = """
                SELECT DISTINCT o.*
                  FROM orders o
                  JOIN order_items oi ON oi.order_id  = o.order_id
                  JOIN listings    l  ON l.listing_id = oi.listing_id
                 WHERE l.seller_id = ?
                 ORDER BY o.created_at DESC
                """;
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, sellerId);
            rs = stmt.executeQuery();
            List<Order> orders = new ArrayList<>();
            while (rs.next()) {
                Order order = mapOrderRow(rs);
                order.setItems(loadItems(order.getOrderId(), conn));
                orders.add(order);
            }
            return orders;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    /**
     * Returns all orders in the system (admin panel).
     * Items are loaded for each order.
     */
    public List<Order> findAll() throws SQLException {
        String sql = "SELECT * FROM orders ORDER BY created_at DESC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
            List<Order> orders = new ArrayList<>();
            while (rs.next()) {
                Order order = mapOrderRow(rs);
                order.setItems(loadItems(order.getOrderId(), conn));
                orders.add(order);
            }
            return orders;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    // ------------------------------------------------------------------
    // Update
    // ------------------------------------------------------------------

    /**
     * Updates the status of an order (e.g. PLACED → SHIPPED → DELIVERED).
     * The trg_restore_stock_on_cancel trigger fires automatically when
     * status transitions to CANCELLED.
     */
    public void updateStatus(int orderId, Order.Status newStatus) throws SQLException {
        String sql = "UPDATE orders SET status = ? WHERE order_id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, newStatus.name());
            stmt.setInt(2, orderId);
            stmt.executeUpdate();
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    // ------------------------------------------------------------------
    // Reporting aggregates
    // ------------------------------------------------------------------

    /**
     * Total revenue from non-cancelled orders within a date range.
     * Used by the admin reports dashboard.
     */
    public BigDecimal getTotalRevenue(LocalDate from, LocalDate to) throws SQLException {
        String sql = """
                SELECT COALESCE(SUM(total_amount), 0) AS revenue
                  FROM orders
                 WHERE status != 'CANCELLED'
                   AND DATE(created_at) BETWEEN ? AND ?
                """;
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setDate(1, Date.valueOf(from));
            stmt.setDate(2, Date.valueOf(to));
            rs = stmt.executeQuery();
            return rs.next() ? rs.getBigDecimal("revenue") : BigDecimal.ZERO;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    /**
     * Returns the top N best-selling products by units sold within a date range.
     * Each row: product_id, shoe_name, brand, units_sold, revenue.
     */
    public List<Object[]> getTopSellingProducts(LocalDate from, LocalDate to,
                                                 int limit) throws SQLException {
        String sql = """
                SELECT p.product_id, p.shoe_name, p.brand,
                       SUM(oi.quantity) AS units_sold,
                       SUM(oi.quantity * oi.price_at_purchase) AS revenue
                  FROM order_items oi
                  JOIN orders   o ON o.order_id   = oi.order_id
                  JOIN listings l ON l.listing_id = oi.listing_id
                  JOIN products p ON p.product_id = l.product_id
                 WHERE o.status != 'CANCELLED'
                   AND DATE(o.created_at) BETWEEN ? AND ?
                 GROUP BY p.product_id, p.shoe_name, p.brand
                 ORDER BY units_sold DESC
                 LIMIT ?
                """;
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setDate(1, Date.valueOf(from));
            stmt.setDate(2, Date.valueOf(to));
            stmt.setInt(3, limit);
            rs = stmt.executeQuery();
            List<Object[]> rows = new ArrayList<>();
            while (rs.next()) {
                rows.add(new Object[]{
                        rs.getInt("product_id"),
                        rs.getString("shoe_name"),
                        rs.getString("brand"),
                        rs.getInt("units_sold"),
                        rs.getBigDecimal("revenue")
                });
            }
            return rows;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private List<OrderItem> loadItems(int orderId, Connection conn) throws SQLException {
        String sql = """
                SELECT oi.order_item_id, oi.order_id, oi.listing_id,
                       oi.quantity, oi.price_at_purchase
                  FROM order_items oi
                 WHERE oi.order_id = ?
                """;
        List<OrderItem> items = new ArrayList<>();
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, orderId);
            rs = stmt.executeQuery();
            while (rs.next()) {
                // Fetch full listing for display (product name, image, etc.)
                int listingId = rs.getInt("listing_id");
                items.add(new OrderItem(
                        rs.getInt("order_item_id"),
                        rs.getInt("order_id"),
                        listingDAO.findById(listingId),
                        rs.getInt("quantity"),
                        rs.getBigDecimal("price_at_purchase")
                ));
            }
        } finally {
            if (rs   != null) try { rs.close();  } catch (SQLException ignored) {}
            if (stmt != null) try { stmt.close(); } catch (SQLException ignored) {}
        }
        return items;
    }

    private Order mapOrderRow(ResultSet rs) throws SQLException {
        Timestamp createdTs = rs.getTimestamp("created_at");
        Timestamp updatedTs = rs.getTimestamp("updated_at");
        return new Order(
                rs.getInt("order_id"),
                rs.getInt("customer_id"),
                rs.getString("shipping_address"),
                rs.getString("shipping_city"),
                rs.getString("shipping_state"),
                rs.getString("shipping_zip"),
                Order.PaymentMethod.valueOf(rs.getString("payment_method")),
                rs.getBigDecimal("total_amount"),
                Order.Status.valueOf(rs.getString("status")),
                createdTs != null ? createdTs.toLocalDateTime() : null,
                updatedTs != null ? updatedTs.toLocalDateTime() : null
        );
    }

    // ------------------------------------------------------------------
    // Exception
    // ------------------------------------------------------------------

    /**
     * Thrown when the CreateOrder stored procedure returns an error message.
     * Callers (servlets) catch this and return the message to the frontend.
     */
    public static class OrderCreationException extends RuntimeException {
        public OrderCreationException(String message) {
            super(message);
        }
    }
}
