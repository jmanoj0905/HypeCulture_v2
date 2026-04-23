package com.hypeculture.servlet;

import com.hypeculture.dao.ProductDAO;
import com.hypeculture.model.Category;
import com.hypeculture.model.Product;
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
 * Handles product catalog endpoints (customer-facing browse + search).
 *
 * GET /api/products               — all active products
 * GET /api/products?categoryId=N  — products filtered by category (UC-02)
 * GET /api/products?search=query  — keyword search across name/brand/model
 * GET /api/products/{id}          — single product by ID
 * POST /api/products              — create product (SELLER or ADMIN)
 */
public class ProductServlet extends HttpServlet {

    private final ProductDAO productDAO = new ProductDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String pathInfo = req.getPathInfo();

        // GET /api/products/{id}
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

        // GET /api/products with optional query params
        String categoryIdParam = req.getParameter("categoryId");
        String searchParam     = req.getParameter("search");

        try {
            if (categoryIdParam != null) {
                int categoryId = Integer.parseInt(categoryIdParam);
                List<Product> products = productDAO.findByCategory(categoryId);
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(products));

            } else if (searchParam != null && !searchParam.isBlank()) {
                List<Product> products = productDAO.search(searchParam.trim());
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(products));

            } else {
                List<Product> products = productDAO.findAll();
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(products));
            }

        } catch (NumberFormatException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Invalid categoryId"));
        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }

    private void handleGetById(String idStr, HttpServletResponse resp)
            throws IOException {
        try {
            int productId = Integer.parseInt(idStr);
            Product product = productDAO.findById(productId);
            if (product == null) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                        JsonUtil.error("Product not found"));
                return;
            }
            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(product));
        } catch (NumberFormatException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Invalid product ID"));
        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        if (!SessionManager.isSeller(req) && !SessionManager.isAdmin(req)) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_FORBIDDEN,
                    JsonUtil.error("Seller or admin account required"));
            return;
        }

        Map<String, Object> body = JsonUtil.fromJson(req.getReader(), Map.class);
        if (body == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Request body required"));
            return;
        }

        try {
            String shoeName = (String) body.get("shoeName");
            String brand = (String) body.get("brand");
            String model = (String) body.getOrDefault("model", "");
            Number categoryIdNum = (Number) body.get("categoryId");
            String description = (String) body.getOrDefault("description", "");
            String imageUrl = (String) body.getOrDefault("imageUrl", "");

            if (shoeName == null || shoeName.isBlank()
                    || brand == null || brand.isBlank()
                    || categoryIdNum == null) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                        JsonUtil.error("shoeName, brand, categoryId are required"));
                return;
            }

            Category category = new Category(categoryIdNum.intValue(), null, null);

            Product product = new Product(
                    0, shoeName.trim(), brand.trim(), model != null ? model.trim() : "",
                    category, description, imageUrl,
                    true, null
            );

            productDAO.insert(product);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_CREATED, JsonUtil.ok(product));

        } catch (ClassCastException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Invalid field type in request body"));
        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }
}
