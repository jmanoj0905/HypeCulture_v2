package com.hypeculture.dao;

import com.hypeculture.model.Category;
import com.hypeculture.model.Product;
import com.hypeculture.util.DBConnection;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for the {@code products} table.
 *
 * Products are the admin-managed master catalog entries.
 * Every query joins categories so callers receive fully-populated
 * Product objects without a second DAO call.
 */
public class ProductDAO {

    private static final String BASE_SELECT = """
            SELECT p.product_id, p.shoe_name, p.brand, p.model,
                   p.description, p.image_url, p.is_active, p.created_at,
                   c.category_id, c.category_name, c.description AS cat_description
              FROM products p
              JOIN categories c ON c.category_id = p.category_id
            """;

    // ------------------------------------------------------------------
    // Lookups
    // ------------------------------------------------------------------

    /**
     * Returns all active products — used by the admin "View All Products" panel.
     */
    public List<Product> findAll() throws SQLException {
        String sql = BASE_SELECT + " WHERE p.is_active = 1 ORDER BY p.brand ASC, p.shoe_name ASC";
        return queryList(sql);
    }

    /**
     * Finds a single product by primary key (active or inactive).
     * Returns {@code null} if not found.
     */
    public Product findById(int productId) throws SQLException {
        String sql = BASE_SELECT + " WHERE p.product_id = ? LIMIT 1";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, productId);
            rs = stmt.executeQuery();
            if (rs.next()) {
                return mapRow(rs);
            }
            return null;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    /**
     * Returns all active products in a given category.
     * Used by UC-02: Browse Shoes by Category.
     */
    public List<Product> findByCategory(int categoryId) throws SQLException {
        String sql = BASE_SELECT
                + " WHERE p.category_id = ? AND p.is_active = 1"
                + " ORDER BY p.brand ASC, p.shoe_name ASC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, categoryId);
            rs = stmt.executeQuery();
            List<Product> products = new ArrayList<>();
            while (rs.next()) {
                products.add(mapRow(rs));
            }
            return products;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    /**
     * Full-text keyword search across shoe_name, brand, and model.
     * Returns active products whose fields contain the keyword (case-insensitive).
     * Used by the search bar in the customer browse view.
     */
    public List<Product> search(String keyword) throws SQLException {
        String sql = BASE_SELECT
                + " WHERE p.is_active = 1"
                + "   AND (p.shoe_name LIKE ? OR p.brand LIKE ? OR p.model LIKE ?)"
                + " ORDER BY p.brand ASC, p.shoe_name ASC";
        String pattern = "%" + keyword + "%";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, pattern);
            stmt.setString(2, pattern);
            stmt.setString(3, pattern);
            rs = stmt.executeQuery();
            List<Product> products = new ArrayList<>();
            while (rs.next()) {
                products.add(mapRow(rs));
            }
            return products;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    /**
     * Checks whether a product with the same brand + model already exists.
     * Used by the admin catalog form to block duplicate entries.
     */
    public boolean existsByBrandAndModel(String brand, String model) throws SQLException {
        String sql = "SELECT 1 FROM products WHERE brand = ? AND model = ? LIMIT 1";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, brand);
            stmt.setString(2, model);
            rs = stmt.executeQuery();
            return rs.next();
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    // ------------------------------------------------------------------
    // Insert / Update
    // ------------------------------------------------------------------

    /**
     * Inserts a new product into the master catalog.
     * Sets the generated product_id on the passed object before returning.
     */
    public void insert(Product product) throws SQLException {
        String sql = """
                INSERT INTO products
                    (shoe_name, brand, model, category_id, description, image_url, is_active)
                VALUES (?, ?, ?, ?, ?, ?, 1)
                """;
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet keys = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setString(1, product.getShoeName());
            stmt.setString(2, product.getBrand());
            stmt.setString(3, product.getModel());
            stmt.setInt(4, product.getCategory().getCategoryId());
            stmt.setString(5, product.getDescription());
            stmt.setString(6, product.getImageUrl());
            stmt.executeUpdate();
            keys = stmt.getGeneratedKeys();
            if (keys.next()) {
                product.setProductId(keys.getInt(1));
            }
        } finally {
            DBConnection.close(conn, stmt, keys);
        }
    }

    /**
     * Updates mutable catalog fields for an existing product.
     * Active listings referencing this product are unaffected.
     */
    public void update(Product product) throws SQLException {
        String sql = """
                UPDATE products
                   SET shoe_name   = ?,
                       brand       = ?,
                       model       = ?,
                       category_id = ?,
                       description = ?,
                       image_url   = ?
                 WHERE product_id  = ?
                """;
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, product.getShoeName());
            stmt.setString(2, product.getBrand());
            stmt.setString(3, product.getModel());
            stmt.setInt(4, product.getCategory().getCategoryId());
            stmt.setString(5, product.getDescription());
            stmt.setString(6, product.getImageUrl());
            stmt.setInt(7, product.getProductId());
            stmt.executeUpdate();
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    /**
     * Soft-deletes a product from the catalog (marks is_active = 0).
     * The servlet layer must confirm no active listings exist first.
     */
    public void deactivate(int productId) throws SQLException {
        String sql = "UPDATE products SET is_active = 0 WHERE product_id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, productId);
            stmt.executeUpdate();
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private List<Product> queryList(String sql) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
            List<Product> products = new ArrayList<>();
            while (rs.next()) {
                products.add(mapRow(rs));
            }
            return products;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    // ------------------------------------------------------------------
    // Row mapper
    // ------------------------------------------------------------------

    private Product mapRow(ResultSet rs) throws SQLException {
        Category category = new Category(
                rs.getInt("category_id"),
                rs.getString("category_name"),
                rs.getString("cat_description")
        );

        Timestamp createdTs = rs.getTimestamp("created_at");
        LocalDateTime createdAt = createdTs != null ? createdTs.toLocalDateTime() : null;

        return new Product(
                rs.getInt("product_id"),
                rs.getString("shoe_name"),
                rs.getString("brand"),
                rs.getString("model"),
                category,
                rs.getString("description"),
                rs.getString("image_url"),
                rs.getBoolean("is_active"),
                createdAt
        );
    }
}
