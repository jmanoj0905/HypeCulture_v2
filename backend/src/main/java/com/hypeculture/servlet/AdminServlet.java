package com.hypeculture.servlet;

import com.hypeculture.dao.ListingDAO;
import com.hypeculture.dao.OrderDAO;
import com.hypeculture.dao.ProductDAO;
import com.hypeculture.dao.UserDAO;
import com.hypeculture.model.Category;
import com.hypeculture.model.Order;
import com.hypeculture.model.Product;
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
import java.util.List;
import java.util.Map;

/**
 * Handles admin-only endpoints.
 *
 * All routes require ADMIN role — 403 returned otherwise.
 *
 * Users
 *   GET  /api/admin/users              — list all users (UC-11)
 *   PUT  /api/admin/users/{id}/deactivate — deactivate a user (UC-12)
 *
 * Products
 *   GET    /api/admin/products         — list all products (UC-13)
 *   POST   /api/admin/products         — add product to catalog (UC-13)
 *   PUT    /api/admin/products/{id}    — update product details (UC-13)
 *   DELETE /api/admin/products/{id}    — deactivate product (UC-13)
 *
 * Orders
 *   GET /api/admin/orders              — list all orders (UC-14)
 *   PUT /api/admin/orders/{id}/status  — update order status (UC-14)
 *
 * Listings
 *   GET /api/admin/listings            — list all listings
 */
@WebServlet("/api/admin/*")
public class AdminServlet extends HttpServlet {

    private final UserDAO    userDAO    = new UserDAO();
    private final ProductDAO productDAO = new ProductDAO();
    private final OrderDAO   orderDAO   = new OrderDAO();
    private final ListingDAO listingDAO = new ListingDAO();

    // ------------------------------------------------------------------
    // Auth guard — all methods go through this
    // ------------------------------------------------------------------

    private boolean guardAdmin(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        if (!SessionManager.isAdmin(req)) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_FORBIDDEN,
                    JsonUtil.error("Admin access required"));
            return false;
        }
        return true;
    }

    // ------------------------------------------------------------------
    // GET
    // ------------------------------------------------------------------

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        if (!guardAdmin(req, resp)) return;

        String path = req.getPathInfo();
        if (path == null) path = "/";

        try {
            if (path.equals("/users")) {
                List<User> users = userDAO.findAll();
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(users));

            } else if (path.equals("/products")) {
                List<Product> products = productDAO.findAll();
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(products));

            } else if (path.equals("/orders")) {
                List<Order> orders = orderDAO.findAll();
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(orders));

            } else if (path.equals("/listings")) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK,
                        JsonUtil.ok(listingDAO.findAll()));

            } else {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                        JsonUtil.error("Not found"));
            }

        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }

    // ------------------------------------------------------------------
    // POST — add product
    // ------------------------------------------------------------------

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        if (!guardAdmin(req, resp)) return;

        String path = req.getPathInfo();
        if (path == null) path = "/";

        if (!path.equals("/products")) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                    JsonUtil.error("Not found"));
            return;
        }

        Map<?, ?> body = JsonUtil.fromJson(req.getReader(), Map.class);
        if (body == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Request body required"));
            return;
        }

        try {
            String shoeName    = (String) body.get("shoeName");
            String brand       = (String) body.get("brand");
            String model       = (String) body.get("model");
            String description = (String) body.getOrDefault("description", "");
            String imageUrl    = (String) body.getOrDefault("imageUrl", "");
            Number categoryIdN = (Number) body.get("categoryId");

            if (shoeName == null || brand == null || model == null || categoryIdN == null) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                        JsonUtil.error("shoeName, brand, model, and categoryId are required"));
                return;
            }

            if (productDAO.existsByBrandAndModel(brand, model)) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_CONFLICT,
                        JsonUtil.error("Product with this brand and model already exists"));
                return;
            }

            Category category = new Category(categoryIdN.intValue(), null, null);
            Product product = new Product(0, shoeName, brand, model, category,
                    description, imageUrl, true, null);
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

    // ------------------------------------------------------------------
    // PUT — update product  |  deactivate user  |  update order status
    // ------------------------------------------------------------------

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        if (!guardAdmin(req, resp)) return;

        String path = req.getPathInfo();
        if (path == null) path = "/";

        try {
            // PUT /api/admin/users/{id}/deactivate
            if (path.matches("/users/\\d+/deactivate")) {
                String[] parts = path.split("/");
                int userId = Integer.parseInt(parts[2]);
                userDAO.deactivate(userId);
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok());

            // PUT /api/admin/orders/{id}/status
            } else if (path.matches("/orders/\\d+/status")) {
                String[] parts = path.split("/");
                int orderId = Integer.parseInt(parts[2]);

                Map<?, ?> body = JsonUtil.fromJson(req.getReader(), Map.class);
                if (body == null) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                            JsonUtil.error("Request body required"));
                    return;
                }

                String statusStr = (String) body.get("status");
                if (statusStr == null) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                            JsonUtil.error("status is required"));
                    return;
                }

                Order.Status newStatus;
                try {
                    newStatus = Order.Status.valueOf(statusStr.toUpperCase());
                } catch (IllegalArgumentException e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                            JsonUtil.error("Invalid status value"));
                    return;
                }

                orderDAO.updateStatus(orderId, newStatus);
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok());

            // PUT /api/admin/products/{id}
            } else if (path.matches("/products/\\d+")) {
                String[] parts = path.split("/");
                int productId = Integer.parseInt(parts[2]);

                Map<?, ?> body = JsonUtil.fromJson(req.getReader(), Map.class);
                if (body == null) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                            JsonUtil.error("Request body required"));
                    return;
                }

                Product existing = productDAO.findById(productId);
                if (existing == null) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                            JsonUtil.error("Product not found"));
                    return;
                }

                String shoeName    = body.get("shoeName")    != null ? (String) body.get("shoeName")    : existing.getShoeName();
                String brand       = body.get("brand")       != null ? (String) body.get("brand")       : existing.getBrand();
                String model       = body.get("model")       != null ? (String) body.get("model")       : existing.getModel();
                String description = body.get("description") != null ? (String) body.get("description") : existing.getDescription();
                String imageUrl    = body.get("imageUrl")    != null ? (String) body.get("imageUrl")    : existing.getImageUrl();
                Number categoryIdN = (Number) body.get("categoryId");
                Category category  = categoryIdN != null
                        ? new Category(categoryIdN.intValue(), null, null)
                        : existing.getCategory();

                Product updated = new Product(productId, shoeName, brand, model,
                        category, description, imageUrl, existing.isActive(), existing.getCreatedAt());
                productDAO.update(updated);
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok());

            } else {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                        JsonUtil.error("Not found"));
            }

        } catch (NumberFormatException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Invalid ID in path"));
        } catch (ClassCastException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Invalid field type in request body"));
        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }

    // ------------------------------------------------------------------
    // DELETE — deactivate product
    // ------------------------------------------------------------------

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        if (!guardAdmin(req, resp)) return;

        String path = req.getPathInfo();
        if (path == null) path = "/";

        // DELETE /api/admin/products/{id}
        if (path.matches("/products/\\d+")) {
            String[] parts = path.split("/");
            try {
                int productId = Integer.parseInt(parts[2]);
                productDAO.deactivate(productId);
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok());
            } catch (NumberFormatException e) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                        JsonUtil.error("Invalid product ID"));
            } catch (SQLException e) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                        JsonUtil.error("Database error: " + e.getMessage()));
            }
        } else {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                    JsonUtil.error("Not found"));
        }
    }
}
