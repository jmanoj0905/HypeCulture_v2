package com.hypeculture.dao;

import com.hypeculture.model.Category;
import com.hypeculture.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for the {@code categories} table.
 */
public class CategoryDAO {

    /**
     * Returns all categories ordered by name.
     * Used to populate the browse menu and admin catalog form.
     */
    public List<Category> findAll() throws SQLException {
        String sql = "SELECT * FROM categories ORDER BY category_name ASC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
            List<Category> categories = new ArrayList<>();
            while (rs.next()) {
                categories.add(mapRow(rs));
            }
            return categories;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    /**
     * Finds a category by its primary key.
     * Returns {@code null} if not found.
     */
    public Category findById(int categoryId) throws SQLException {
        String sql = "SELECT * FROM categories WHERE category_id = ? LIMIT 1";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, categoryId);
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
     * Inserts a new category.
     * Sets the generated category_id on the passed object before returning.
     */
    public void insert(Category category) throws SQLException {
        String sql = "INSERT INTO categories (category_name, description) VALUES (?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet keys = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setString(1, category.getCategoryName());
            stmt.setString(2, category.getDescription());
            stmt.executeUpdate();
            keys = stmt.getGeneratedKeys();
            if (keys.next()) {
                category.setCategoryId(keys.getInt(1));
            }
        } finally {
            DBConnection.close(conn, stmt, keys);
        }
    }

    // ------------------------------------------------------------------
    // Row mapper
    // ------------------------------------------------------------------

    private Category mapRow(ResultSet rs) throws SQLException {
        return new Category(
                rs.getInt("category_id"),
                rs.getString("category_name"),
                rs.getString("description")
        );
    }
}
