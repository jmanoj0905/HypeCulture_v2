package com.hypeculture.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Singleton-style JDBC connection manager.
 *
 * Configuration is read from environment variables so credentials
 * are never hardcoded. Sensible defaults let the app start in a
 * local dev environment without any extra setup.
 *
 * Environment variables:
 *   DB_URL      — full JDBC URL  (default: jdbc:mysql://localhost:3306/hypeculture_db)
 *   DB_USER     — database user  (default: root)
 *   DB_PASSWORD — database password (default: empty string)
 *
 * Usage:
 *   Connection conn = DBConnection.getConnection();
 *   // ... use conn ...
 *   DBConnection.close(conn, stmt, rs);
 */
public class DBConnection {

    private static final String DEFAULT_URL  = "jdbc:mysql://localhost:3306/hypeculture_db"
            + "?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static final String DEFAULT_USER = "root";
    private static final String DEFAULT_PASS = "";

    private static final String URL;
    private static final String USER;
    private static final String PASSWORD;

    static {
        URL      = getEnvOrDefault("DB_URL",      DEFAULT_URL);
        USER     = getEnvOrDefault("DB_USER",     DEFAULT_USER);
        PASSWORD = getEnvOrDefault("DB_PASSWORD", DEFAULT_PASS);

        try {
            // Explicitly load the driver — required for some servlet containers
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new ExceptionInInitializerError(
                "MySQL JDBC driver not found on classpath: " + e.getMessage()
            );
        }
    }

    private DBConnection() {
        // Utility class — no instantiation
    }

    /**
     * Opens and returns a new JDBC connection.
     * Each DAO call is responsible for closing the connection it receives.
     *
     * @return a live {@link Connection}
     * @throws SQLException if the connection cannot be established
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    /**
     * Quietly closes a Connection, Statement, and ResultSet in that order.
     * Any of the parameters may be {@code null} — they are safely skipped.
     *
     * @param conn the connection to close
     * @param stmt the statement to close (may be null)
     * @param rs   the result set to close (may be null)
     */
    public static void close(
            java.sql.Connection conn,
            java.sql.Statement stmt,
            java.sql.ResultSet rs
    ) {
        if (rs   != null) { try { rs.close();   } catch (SQLException ignored) {} }
        if (stmt != null) { try { stmt.close();  } catch (SQLException ignored) {} }
        if (conn != null) { try { conn.close();  } catch (SQLException ignored) {} }
    }

    /**
     * Closes a Connection and Statement only (no ResultSet).
     * Convenience overload for INSERT / UPDATE / DELETE operations.
     */
    public static void close(java.sql.Connection conn, java.sql.Statement stmt) {
        close(conn, stmt, null);
    }

    /**
     * Closes a Connection only.
     * Use when the DAO manages its own statement lifecycle.
     */
    public static void close(java.sql.Connection conn) {
        close(conn, null, null);
    }

    // ------------------------------------------------------------------

    private static String getEnvOrDefault(String key, String defaultValue) {
        String value = System.getenv(key);
        return (value != null && !value.isBlank()) ? value : defaultValue;
    }
}
