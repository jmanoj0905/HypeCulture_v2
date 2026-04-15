package com.hypeculture.servlet;

import com.hypeculture.dao.CategoryDAO;
import com.hypeculture.model.Category;
import com.hypeculture.util.JsonUtil;
import com.hypeculture.util.SessionManager;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Handles category endpoints.
 *
 * GET  /api/categories      — list all categories (public, used for browse menu)
 * GET  /api/categories/{id} — single category by ID
 * POST /api/categories      — create a new category (ADMIN only)
 */
public class CategoryServlet extends HttpServlet {

    private final CategoryDAO categoryDAO = new CategoryDAO();

    // ------------------------------------------------------------------
    // GET
    // ------------------------------------------------------------------

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String pathInfo = req.getPathInfo();

        // GET /api/categories/{id}
        if (pathInfo != null && pathInfo.length() > 1) {
            String[] parts = pathInfo.split("/");
            if (parts.length == 2) {
                handleGetById(parts[1], resp);
                return;
            }
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                    JsonUtil.error("Not found"));
            return;
        }

        // GET /api/categories
        try {
            List<Category> categories = categoryDAO.findAll();
            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(categories));
        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }

    private void handleGetById(String idStr, HttpServletResponse resp)
            throws IOException {
        try {
            int categoryId = Integer.parseInt(idStr);
            Category category = categoryDAO.findById(categoryId);
            if (category == null) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                        JsonUtil.error("Category not found"));
                return;
            }
            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(category));
        } catch (NumberFormatException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Invalid category ID"));
        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }

    // ------------------------------------------------------------------
    // POST /api/categories — ADMIN only
    // ------------------------------------------------------------------

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        if (!SessionManager.isAdmin(req)) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_FORBIDDEN,
                    JsonUtil.error("Admin access required"));
            return;
        }

        Map<String, Object> body = JsonUtil.fromJson(req.getReader(), Map.class);
        if (body == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Request body required"));
            return;
        }

        String name        = (String) body.get("categoryName");
        String description = (String) body.getOrDefault("description", "");

        if (name == null || name.isBlank()) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("categoryName is required"));
            return;
        }

        try {
            Category category = new Category(0, name.trim(), description);
            categoryDAO.insert(category);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_CREATED, JsonUtil.ok(category));
        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }
}
