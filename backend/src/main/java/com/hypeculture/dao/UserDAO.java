package com.hypeculture.dao;

import com.hypeculture.model.Admin;
import com.hypeculture.model.Customer;
import com.hypeculture.model.Seller;
import com.hypeculture.model.User;
import com.hypeculture.util.DBConnection;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for the {@code users} table.
 *
 * Handles all CRUD operations and authentication queries for the
 * User hierarchy (Customer, Seller, Admin). Callers receive concrete
 * subclass instances — they never deal with the raw role string.
 *
 * All queries use PreparedStatements. No string concatenation.
 */
public class UserDAO {

    // ------------------------------------------------------------------
    // Authentication
    // ------------------------------------------------------------------

    /**
     * Looks up an ACTIVE user by email and returns the appropriate subclass.
     * Returns {@code null} if no matching active user exists.
     *
     * Password verification is done by the caller (PasswordUtil.verify)
     * against the returned passwordHash — this method does not check it.
     */
    public User findByEmail(String email) throws SQLException {
        String sql = "SELECT * FROM users WHERE email = ? AND status = 'ACTIVE' LIMIT 1";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, email);
            rs = stmt.executeQuery();
            if (rs.next()) {
                return mapRow(rs);
            }
            return null;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    // ------------------------------------------------------------------
    // Lookups
    // ------------------------------------------------------------------

    /**
     * Finds any user by primary key regardless of status.
     * Returns {@code null} if not found.
     */
    public User findById(int userId) throws SQLException {
        String sql = "SELECT * FROM users WHERE user_id = ? LIMIT 1";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
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
     * Returns all ACTIVE users with the given role.
     * Used by the admin panel to list customers or sellers.
     */
    public List<User> findByRole(User.Role role) throws SQLException {
        String sql = "SELECT * FROM users WHERE role = ? AND status = 'ACTIVE' ORDER BY created_at DESC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, role.name());
            rs = stmt.executeQuery();
            List<User> users = new ArrayList<>();
            while (rs.next()) {
                users.add(mapRow(rs));
            }
            return users;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    /**
     * Returns all users (all roles, all statuses) for the admin user management panel.
     */
    public List<User> findAll() throws SQLException {
        String sql = "SELECT * FROM users ORDER BY created_at DESC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
            List<User> users = new ArrayList<>();
            while (rs.next()) {
                users.add(mapRow(rs));
            }
            return users;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    /**
     * Returns true if an ACTIVE user already exists with this email.
     * Used during registration and admin user-creation to catch duplicates.
     */
    public boolean emailExists(String email) throws SQLException {
        String sql = "SELECT 1 FROM users WHERE email = ? LIMIT 1";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, email);
            rs = stmt.executeQuery();
            return rs.next();
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    /**
     * Returns true if an ACTIVE user already exists with this username.
     */
    public boolean usernameExists(String username) throws SQLException {
        String sql = "SELECT 1 FROM users WHERE username = ? LIMIT 1";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, username);
            rs = stmt.executeQuery();
            return rs.next();
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    // ------------------------------------------------------------------
    // Insert
    // ------------------------------------------------------------------

    /**
     * Inserts a new Customer into the users table.
     * Sets the generated user_id on the passed object before returning.
     */
    public void insertCustomer(Customer customer) throws SQLException {
        String sql = """
                INSERT INTO users
                    (username, email, password_hash, role, status,
                     shipping_address, city, state, zip_code)
                VALUES (?, ?, ?, 'CUSTOMER', 'ACTIVE', ?, ?, ?, ?)
                """;
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet keys = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setString(1, customer.getUsername());
            stmt.setString(2, customer.getEmail());
            stmt.setString(3, customer.getPasswordHash());
            stmt.setString(4, customer.getShippingAddress());
            stmt.setString(5, customer.getCity());
            stmt.setString(6, customer.getState());
            stmt.setString(7, customer.getZipCode());
            stmt.executeUpdate();
            keys = stmt.getGeneratedKeys();
            if (keys.next()) {
                customer.setUserId(keys.getInt(1));
            }
        } finally {
            DBConnection.close(conn, stmt, keys);
        }
    }

    /**
     * Inserts a new Seller into the users table.
     */
    public void insertSeller(Seller seller) throws SQLException {
        String sql = """
                INSERT INTO users
                    (username, email, password_hash, role, status,
                     seller_rating, total_sales, is_verified)
                VALUES (?, ?, ?, 'SELLER', 'ACTIVE', ?, ?, ?)
                """;
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet keys = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setString(1, seller.getUsername());
            stmt.setString(2, seller.getEmail());
            stmt.setString(3, seller.getPasswordHash());
            stmt.setBigDecimal(4, seller.getSellerRating());
            stmt.setInt(5, seller.getTotalSales());
            stmt.setBoolean(6, seller.isVerified());
            stmt.executeUpdate();
            keys = stmt.getGeneratedKeys();
            if (keys.next()) {
                seller.setUserId(keys.getInt(1));
            }
        } finally {
            DBConnection.close(conn, stmt, keys);
        }
    }

    // ------------------------------------------------------------------
    // Update
    // ------------------------------------------------------------------

    /**
     * Updates shipping address fields for a customer.
     */
    public void updateShippingAddress(int customerId, String address,
                                      String city, String state,
                                      String zipCode) throws SQLException {
        String sql = """
                UPDATE users
                   SET shipping_address = ?,
                       city             = ?,
                       state            = ?,
                       zip_code         = ?
                 WHERE user_id = ?
                   AND role    = 'CUSTOMER'
                """;
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, address);
            stmt.setString(2, city);
            stmt.setString(3, state);
            stmt.setString(4, zipCode);
            stmt.setInt(5, customerId);
            stmt.executeUpdate();
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    // ------------------------------------------------------------------
    // Soft delete
    // ------------------------------------------------------------------

    /**
     * Deactivates a user account (soft delete — preserves order/transaction history).
     * The user can no longer log in; their listings are hidden by status filters.
     */
    public void deactivate(int userId) throws SQLException {
        String sql = "UPDATE users SET status = 'INACTIVE' WHERE user_id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
            stmt.executeUpdate();
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public void activate(int userId) throws SQLException {
        String sql = "UPDATE users SET status = 'ACTIVE' WHERE user_id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
            stmt.executeUpdate();
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    // ------------------------------------------------------------------
    // Row mapper
    // ------------------------------------------------------------------

    /**
     * Maps the current ResultSet row to the correct User subclass based
     * on the {@code role} column.
     */
    private User mapRow(ResultSet rs) throws SQLException {
        String roleStr = rs.getString("role");
        User.Role role = User.Role.valueOf(roleStr);

        int           id           = rs.getInt("user_id");
        String        username     = rs.getString("username");
        String        email        = rs.getString("email");
        String        passwordHash = rs.getString("password_hash");
        User.Status   status       = User.Status.valueOf(rs.getString("status"));
        LocalDateTime createdAt    = rs.getTimestamp("created_at").toLocalDateTime();

        return switch (role) {
            case CUSTOMER -> {
                Customer c = new Customer(
                        id, username, email, passwordHash, status, createdAt,
                        rs.getString("shipping_address"),
                        rs.getString("city"),
                        rs.getString("state"),
                        rs.getString("zip_code")
                );
                yield c;
            }
            case SELLER -> {
                BigDecimal rating = rs.getBigDecimal("seller_rating");
                yield new Seller(
                        id, username, email, passwordHash, status, createdAt,
                        rating != null ? rating : BigDecimal.ZERO,
                        rs.getInt("total_sales"),
                        rs.getBoolean("is_verified")
                );
            }
            case ADMIN -> new Admin(
                    id, username, email, passwordHash, status, createdAt,
                    rs.getInt("admin_level")
            );
        };
    }
}
