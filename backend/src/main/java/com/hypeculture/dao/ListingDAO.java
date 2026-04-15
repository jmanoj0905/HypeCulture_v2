package com.hypeculture.dao;

import com.hypeculture.model.Category;
import com.hypeculture.model.Listing;
import com.hypeculture.model.Product;
import com.hypeculture.model.Seller;
import com.hypeculture.util.DBConnection;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for the {@code listings} table.
 *
 * Every query joins products and categories so callers receive
 * fully-populated Listing objects. Seller is mapped as a lightweight
 * stub (id, username, rating, verified) — enough for display without
 * pulling the full user row.
 */
public class ListingDAO {

    private static final String BASE_SELECT = """
            SELECT l.listing_id, l.size, l.condition_type, l.price,
                   l.stock_quantity, l.status, l.description, l.image_url,
                   l.created_at, l.updated_at,
                   p.product_id, p.shoe_name, p.brand, p.model,
                   p.description  AS prod_description,
                   p.image_url    AS prod_image_url,
                   p.is_active    AS prod_is_active,
                   p.created_at   AS prod_created_at,
                   c.category_id, c.category_name, c.description AS cat_description,
                   u.user_id      AS seller_id,
                   u.username     AS seller_username,
                   u.seller_rating,
                   u.is_verified
              FROM listings l
              JOIN products    p ON p.product_id  = l.product_id
              JOIN categories  c ON c.category_id = p.category_id
              JOIN users       u ON u.user_id      = l.seller_id
            """;

    // ------------------------------------------------------------------
    // Browse queries (customer-facing)
    // ------------------------------------------------------------------

    /**
     * Returns all ACTIVE listings for a given category, sorted by price ASC.
     * Powers UC-02: Browse Shoes by Category + Sort by Cheapest Price.
     */
    public List<Listing> findByCategoryOrderByPrice(int categoryId) throws SQLException {
        String sql = BASE_SELECT
                + " WHERE p.category_id = ? AND l.status = 'ACTIVE'"
                + " ORDER BY l.price ASC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, categoryId);
            rs = stmt.executeQuery();
            return collectRows(rs);
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    /**
     * Returns all ACTIVE listings for a specific product, sorted by price ASC.
     * Powers UC-03: View Sellers for a Shoe.
     */
    public List<Listing> findByProductOrderByPrice(int productId) throws SQLException {
        String sql = BASE_SELECT
                + " WHERE l.product_id = ? AND l.status = 'ACTIVE'"
                + " ORDER BY l.price ASC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, productId);
            rs = stmt.executeQuery();
            return collectRows(rs);
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    /**
     * Finds a single listing by primary key regardless of status.
     * Used for cart/checkout stock validation and seller inventory detail.
     * Returns {@code null} if not found.
     */
    public Listing findById(int listingId) throws SQLException {
        String sql = BASE_SELECT + " WHERE l.listing_id = ? LIMIT 1";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, listingId);
            rs = stmt.executeQuery();
            if (rs.next()) return mapRow(rs);
            return null;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    // ------------------------------------------------------------------
    // Seller inventory queries
    // ------------------------------------------------------------------

    /**
     * Returns all listings (any status) belonging to a seller, newest first.
     * Powers UC-09: Manage Inventory.
     */
    public List<Listing> findBySeller(int sellerId) throws SQLException {
        String sql = BASE_SELECT
                + " WHERE l.seller_id = ?"
                + " ORDER BY l.created_at DESC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, sellerId);
            rs = stmt.executeQuery();
            return collectRows(rs);
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    /**
     * Returns only ACTIVE listings for a seller — used for the public-facing
     * seller profile view.
     */
    public List<Listing> findActiveListingsBySeller(int sellerId) throws SQLException {
        String sql = BASE_SELECT
                + " WHERE l.seller_id = ? AND l.status = 'ACTIVE'"
                + " ORDER BY l.price ASC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, sellerId);
            rs = stmt.executeQuery();
            return collectRows(rs);
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    // ------------------------------------------------------------------
    // Insert
    // ------------------------------------------------------------------

    /**
     * Creates a new listing.
     * The product must already exist in the catalog (validated by the servlet
     * before this call — UC-08 Validate Product in Catalog).
     * Sets the generated listing_id on the passed object.
     */
    public void insert(Listing listing) throws SQLException {
        String sql = """
                INSERT INTO listings
                    (product_id, seller_id, size, condition_type, price,
                     stock_quantity, status, description, image_url)
                VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?)
                """;
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet keys = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setInt(1, listing.getProduct().getProductId());
            stmt.setInt(2, listing.getSeller().getUserId());
            stmt.setDouble(3, listing.getSize());
            stmt.setString(4, listing.getCondition().name());
            stmt.setBigDecimal(5, listing.getPrice());
            stmt.setInt(6, listing.getStockQuantity());
            stmt.setString(7, listing.getDescription());
            stmt.setString(8, listing.getImageUrl());
            stmt.executeUpdate();
            keys = stmt.getGeneratedKeys();
            if (keys.next()) {
                listing.setListingId(keys.getInt(1));
            }
        } finally {
            DBConnection.close(conn, stmt, keys);
        }
    }

    // ------------------------------------------------------------------
    // Update
    // ------------------------------------------------------------------

    /**
     * Updates price and stock for an existing listing.
     * Delegates ownership validation and business rules to the
     * UpdateListingInventory stored procedure.
     *
     * @param listingId  the listing to update
     * @param sellerId   must match the listing's seller_id (SP enforces this)
     * @param newPrice   new asking price, must be > 0
     * @param newStock   new stock quantity, must be >= 0
     * @return null on success, or an error message string on failure
     */
    public String updatePriceAndStock(int listingId, int sellerId,
                                      BigDecimal newPrice, int newStock) throws SQLException {
        String sql = "CALL UpdateListingInventory(?, ?, ?, ?, @err)";
        String fetchError = "SELECT @err AS error_message";
        Connection conn = null;
        PreparedStatement callStmt = null;
        PreparedStatement errStmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            callStmt = conn.prepareStatement(sql);
            callStmt.setInt(1, listingId);
            callStmt.setInt(2, sellerId);
            callStmt.setBigDecimal(3, newPrice);
            callStmt.setInt(4, newStock);
            callStmt.execute();

            errStmt = conn.prepareStatement(fetchError);
            rs = errStmt.executeQuery();
            if (rs.next()) {
                return rs.getString("error_message"); // null = success
            }
            return null;
        } finally {
            if (rs       != null) try { rs.close();       } catch (SQLException ignored) {}
            if (errStmt  != null) try { errStmt.close();  } catch (SQLException ignored) {}
            if (callStmt != null) try { callStmt.close(); } catch (SQLException ignored) {}
            DBConnection.close(conn);
        }
    }

    // ------------------------------------------------------------------
    // Soft delete
    // ------------------------------------------------------------------

    /**
     * Soft-deletes a listing via the SoftDeleteListing stored procedure.
     * Blocks removal if the listing has active/pending orders.
     *
     * @return null on success, or an error message string on failure
     */
    public String softDelete(int listingId, int sellerId) throws SQLException {
        String sql = "CALL SoftDeleteListing(?, ?, @err)";
        String fetchError = "SELECT @err AS error_message";
        Connection conn = null;
        PreparedStatement callStmt = null;
        PreparedStatement errStmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            callStmt = conn.prepareStatement(sql);
            callStmt.setInt(1, listingId);
            callStmt.setInt(2, sellerId);
            callStmt.execute();

            errStmt = conn.prepareStatement(fetchError);
            rs = errStmt.executeQuery();
            if (rs.next()) {
                return rs.getString("error_message"); // null = success
            }
            return null;
        } finally {
            if (rs       != null) try { rs.close();       } catch (SQLException ignored) {}
            if (errStmt  != null) try { errStmt.close();  } catch (SQLException ignored) {}
            if (callStmt != null) try { callStmt.close(); } catch (SQLException ignored) {}
            DBConnection.close(conn);
        }
    }

    // ------------------------------------------------------------------
    // Stock check
    // ------------------------------------------------------------------

    /**
     * Returns true if the listing has enough stock for the requested quantity.
     * Called by CartServlet and CheckoutServlet before mutating state.
     */
    public boolean hasStock(int listingId, int requestedQty) throws SQLException {
        String sql = """
                SELECT stock_quantity FROM listings
                 WHERE listing_id = ? AND status = 'ACTIVE'
                """;
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, listingId);
            rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt("stock_quantity") >= requestedQty;
            }
            return false;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    // ------------------------------------------------------------------
    // Admin
    // ------------------------------------------------------------------

    /**
     * Returns all listings across all sellers (admin panel — View All Products).
     */
    public List<Listing> findAll() throws SQLException {
        String sql = BASE_SELECT + " ORDER BY l.created_at DESC";
        return queryList(sql);
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private List<Listing> queryList(String sql) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
            return collectRows(rs);
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    private List<Listing> collectRows(ResultSet rs) throws SQLException {
        List<Listing> listings = new ArrayList<>();
        while (rs.next()) {
            listings.add(mapRow(rs));
        }
        return listings;
    }

    // ------------------------------------------------------------------
    // Row mapper
    // ------------------------------------------------------------------

    private Listing mapRow(ResultSet rs) throws SQLException {
        Category category = new Category(
                rs.getInt("category_id"),
                rs.getString("category_name"),
                rs.getString("cat_description")
        );

        Timestamp prodTs = rs.getTimestamp("prod_created_at");
        Product product = new Product(
                rs.getInt("product_id"),
                rs.getString("shoe_name"),
                rs.getString("brand"),
                rs.getString("model"),
                category,
                rs.getString("prod_description"),
                rs.getString("prod_image_url"),
                rs.getBoolean("prod_is_active"),
                prodTs != null ? prodTs.toLocalDateTime() : null
        );

        // Lightweight seller stub — enough for display
        Seller seller = new Seller(
                rs.getInt("seller_id"),
                rs.getString("seller_username"),
                null, null,           // email and passwordHash not needed here
                null, null,
                rs.getBigDecimal("seller_rating"),
                0,
                rs.getBoolean("is_verified")
        );

        Timestamp createdTs = rs.getTimestamp("created_at");
        Timestamp updatedTs = rs.getTimestamp("updated_at");

        return new Listing(
                rs.getInt("listing_id"),
                product,
                seller,
                rs.getDouble("size"),
                Listing.Condition.valueOf(rs.getString("condition_type")),
                rs.getBigDecimal("price"),
                rs.getInt("stock_quantity"),
                Listing.Status.valueOf(rs.getString("status")),
                rs.getString("description"),
                rs.getString("image_url"),
                createdTs != null ? createdTs.toLocalDateTime() : null,
                updatedTs != null ? updatedTs.toLocalDateTime() : null
        );
    }
}
