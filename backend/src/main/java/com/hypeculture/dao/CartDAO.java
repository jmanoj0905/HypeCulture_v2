package com.hypeculture.dao;

import com.hypeculture.model.Cart;
import com.hypeculture.model.CartItem;
import com.hypeculture.model.Listing;
import com.hypeculture.util.DBConnection;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for the {@code carts} and {@code cart_items} tables.
 *
 * A cart is created lazily on first add-to-cart. The trigger on orders INSERT
 * clears the cart automatically after checkout — this DAO does not need to
 * handle that case.
 */
public class CartDAO {

    private final ListingDAO listingDAO = new ListingDAO();

    // ------------------------------------------------------------------
    // Read
    // ------------------------------------------------------------------

    /**
     * Returns the customer's cart fully populated with CartItems.
     * Creates a new empty cart row if none exists yet (lazy init).
     */
    public Cart getOrCreateCart(int customerId) throws SQLException {
        Cart cart = findByCustomer(customerId);
        if (cart == null) {
            cart = createCart(customerId);
        }
        return cart;
    }

    /**
     * Returns the customer's cart with all items, or {@code null} if no cart exists.
     */
    public Cart findByCustomer(int customerId) throws SQLException {
        String sql = "SELECT * FROM carts WHERE customer_id = ? LIMIT 1";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, customerId);
            rs = stmt.executeQuery();
            if (!rs.next()) return null;

            Cart cart = new Cart(
                    rs.getInt("cart_id"),
                    rs.getInt("customer_id"),
                    rs.getTimestamp("created_at").toLocalDateTime()
            );
            cart.setItems(loadItems(cart.getCartId(), conn));
            return cart;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    // ------------------------------------------------------------------
    // Mutations
    // ------------------------------------------------------------------

    /**
     * Adds a listing to the customer's cart.
     * If the listing is already in the cart, increments its quantity instead.
     * Creates the cart row first if it doesn't exist.
     */
    public void addItem(int customerId, int listingId, int quantity) throws SQLException {
        Cart cart = getOrCreateCart(customerId);
        int cartId = cart.getCartId();

        // Check if the listing is already in the cart
        String checkSql = "SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = ? AND listing_id = ? LIMIT 1";
        String insertSql = "INSERT INTO cart_items (cart_id, listing_id, quantity) VALUES (?, ?, ?)";
        String updateSql = "UPDATE cart_items SET quantity = quantity + ? WHERE cart_item_id = ?";

        Connection conn = null;
        PreparedStatement checkStmt  = null;
        PreparedStatement mutateStmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            checkStmt = conn.prepareStatement(checkSql);
            checkStmt.setInt(1, cartId);
            checkStmt.setInt(2, listingId);
            rs = checkStmt.executeQuery();

            if (rs.next()) {
                // Already in cart — increment
                int existingItemId = rs.getInt("cart_item_id");
                mutateStmt = conn.prepareStatement(updateSql);
                mutateStmt.setInt(1, quantity);
                mutateStmt.setInt(2, existingItemId);
            } else {
                // New item
                mutateStmt = conn.prepareStatement(insertSql);
                mutateStmt.setInt(1, cartId);
                mutateStmt.setInt(2, listingId);
                mutateStmt.setInt(3, quantity);
            }
            mutateStmt.executeUpdate();
        } finally {
            if (rs != null)         try { rs.close();         } catch (SQLException ignored) {}
            if (checkStmt != null)  try { checkStmt.close();  } catch (SQLException ignored) {}
            if (mutateStmt != null) try { mutateStmt.close(); } catch (SQLException ignored) {}
            DBConnection.close(conn);
        }
    }

    /**
     * Removes a single cart item by its cart_item_id.
     * Verifies the item belongs to the customer's cart before deleting
     * to prevent cross-customer tampering.
     */
    public void removeItem(int customerId, int cartItemId) throws SQLException {
        String sql = """
                DELETE ci FROM cart_items ci
                  JOIN carts c ON c.cart_id = ci.cart_id
                 WHERE ci.cart_item_id = ?
                   AND c.customer_id   = ?
                """;
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, cartItemId);
            stmt.setInt(2, customerId);
            stmt.executeUpdate();
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    /**
     * Deletes the entire cart and all its items for a customer.
     * FK ON DELETE CASCADE on cart_items handles item removal.
     * Called explicitly if needed; checkout clears the cart via trigger.
     */
    public void clearCart(int customerId) throws SQLException {
        String sql = "DELETE FROM carts WHERE customer_id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, customerId);
            stmt.executeUpdate();
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    /**
     * Returns the total number of distinct items in the customer's cart.
     * Used for the navbar cart badge.
     */
    public int getItemCount(int customerId) throws SQLException {
        String sql = """
                SELECT COALESCE(SUM(ci.quantity), 0)
                  FROM cart_items ci
                  JOIN carts c ON c.cart_id = ci.cart_id
                 WHERE c.customer_id = ?
                """;
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, customerId);
            rs = stmt.executeQuery();
            return rs.next() ? rs.getInt(1) : 0;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private Cart createCart(int customerId) throws SQLException {
        String sql = "INSERT INTO carts (customer_id) VALUES (?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet keys = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setInt(1, customerId);
            stmt.executeUpdate();
            keys = stmt.getGeneratedKeys();
            int cartId = keys.next() ? keys.getInt(1) : 0;
            return new Cart(cartId, customerId, LocalDateTime.now());
        } finally {
            DBConnection.close(conn, stmt, keys);
        }
    }

    /**
     * Loads cart items for a given cartId using an existing open connection.
     * Reuses the caller's connection to avoid opening a second one mid-read.
     */
    private List<CartItem> loadItems(int cartId, Connection conn) throws SQLException {
        String sql = """
                SELECT ci.cart_item_id, ci.cart_id, ci.listing_id,
                       ci.quantity, ci.added_at
                  FROM cart_items ci
                 WHERE ci.cart_id = ?
                 ORDER BY ci.added_at ASC
                """;
        List<CartItem> items = new ArrayList<>();
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, cartId);
            rs = stmt.executeQuery();
            while (rs.next()) {
                int listingId = rs.getInt("listing_id");
                Listing listing = listingDAO.findById(listingId);
                Timestamp addedTs = rs.getTimestamp("added_at");
                items.add(new CartItem(
                        rs.getInt("cart_item_id"),
                        rs.getInt("cart_id"),
                        listing,
                        rs.getInt("quantity"),
                        addedTs != null ? addedTs.toLocalDateTime() : null
                ));
            }
        } finally {
            if (rs   != null) try { rs.close();   } catch (SQLException ignored) {}
            if (stmt != null) try { stmt.close();  } catch (SQLException ignored) {}
        }
        return items;
    }
}
