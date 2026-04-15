package com.hypeculture.servlet;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.hypeculture.dao.UserDAO;
import com.hypeculture.model.Customer;
import com.hypeculture.model.User;
import com.hypeculture.util.JsonUtil;
import com.hypeculture.util.SessionManager;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

/**
 * Handles authentication endpoints.
 *
 * POST /api/auth/login    — verify credentials and start session (UC-01)
 * POST /api/auth/logout   — invalidate session
 * POST /api/auth/register — register a new customer account (UC-01)
 * GET  /api/auth/me       — return current session user info
 */
@WebServlet("/api/auth/*")
public class AuthServlet extends HttpServlet {

    private final UserDAO userDAO = new UserDAO();

    // ------------------------------------------------------------------
    // GET /api/auth/me
    // ------------------------------------------------------------------

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String path = req.getPathInfo();
        if ("/me".equals(path)) {
            handleMe(req, resp);
        } else {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                    JsonUtil.error("Not found"));
        }
    }

    // ------------------------------------------------------------------
    // POST /api/auth/login | /logout | /register
    // ------------------------------------------------------------------

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String path = req.getPathInfo();
        if (path == null) path = "/";

        switch (path) {
            case "/login"    -> handleLogin(req, resp);
            case "/logout"   -> handleLogout(req, resp);
            case "/register" -> handleRegister(req, resp);
            default          -> JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                                       JsonUtil.error("Not found"));
        }
    }

    // ------------------------------------------------------------------
    // Handlers
    // ------------------------------------------------------------------

    private void handleLogin(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        Map<?, ?> body = JsonUtil.fromJson(req.getReader(), Map.class);
        if (body == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Request body required"));
            return;
        }

        String email    = (String) body.get("email");
        String password = (String) body.get("password");

        if (email == null || password == null || email.isBlank() || password.isBlank()) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Email and password are required"));
            return;
        }

        try {
            User user = userDAO.findByEmail(email.trim().toLowerCase());
            if (user == null) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_UNAUTHORIZED,
                        JsonUtil.error("Invalid email or password"));
                return;
            }

            BCrypt.Result result = BCrypt.verifyer()
                    .verify(password.toCharArray(), user.getPasswordHash());
            if (!result.verified) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_UNAUTHORIZED,
                        JsonUtil.error("Invalid email or password"));
                return;
            }

            SessionManager.login(req, user);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK,
                    JsonUtil.ok(buildUserMap(user)));

        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Login failed: " + e.getMessage()));
        }
    }

    private void handleLogout(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        SessionManager.logout(req);
        JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok());
    }

    private void handleRegister(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        Map<?, ?> body = JsonUtil.fromJson(req.getReader(), Map.class);
        if (body == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Request body required"));
            return;
        }

        String username = (String) body.get("username");
        String email    = (String) body.get("email");
        String password = (String) body.get("password");
        String address  = (String) body.getOrDefault("shippingAddress", "");
        String city     = (String) body.getOrDefault("city", "");
        String state    = (String) body.getOrDefault("state", "");
        String zip      = (String) body.getOrDefault("zipCode", "");

        if (username == null || email == null || password == null
                || username.isBlank() || email.isBlank() || password.isBlank()) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("username, email, and password are required"));
            return;
        }

        if (password.length() < 6) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Password must be at least 6 characters"));
            return;
        }

        try {
            if (userDAO.emailExists(email.trim().toLowerCase())) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_CONFLICT,
                        JsonUtil.error("Email already registered"));
                return;
            }
            if (userDAO.usernameExists(username.trim())) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_CONFLICT,
                        JsonUtil.error("Username already taken"));
                return;
            }

            String hash = BCrypt.withDefaults().hashToString(12, password.toCharArray());

            Customer customer = new Customer(
                    0, username.trim(), email.trim().toLowerCase(),
                    hash, User.Status.ACTIVE, null,
                    address, city, state, zip
            );
            userDAO.insertCustomer(customer);

            SessionManager.login(req, customer);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_CREATED,
                    JsonUtil.ok(buildUserMap(customer)));

        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Registration failed: " + e.getMessage()));
        }
    }

    private void handleMe(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        if (!SessionManager.isLoggedIn(req)) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_UNAUTHORIZED,
                    JsonUtil.error("Not authenticated"));
            return;
        }

        Map<String, Object> info = new HashMap<>();
        info.put("userId",   SessionManager.getUserId(req));
        info.put("role",     SessionManager.getRole(req));
        info.put("username", SessionManager.getUsername(req));
        JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(info));
    }

    // ------------------------------------------------------------------
    // Helper
    // ------------------------------------------------------------------

    private Map<String, Object> buildUserMap(User user) {
        Map<String, Object> m = new HashMap<>();
        m.put("userId",   user.getUserId());
        m.put("username", user.getUsername());
        m.put("email",    user.getEmail());
        m.put("role",     user.getRole().name());
        return m;
    }
}
