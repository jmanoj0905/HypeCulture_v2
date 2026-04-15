package com.hypeculture.servlet;

import com.hypeculture.dao.CartDAO;
import com.hypeculture.dao.ListingDAO;
import com.hypeculture.model.Cart;
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
 * Handles shopping cart endpoints.
 *
 * GET    /api/cart            — get current customer's cart with item count
 * GET    /api/cart/count      — get item count only (for navbar badge)
 * POST   /api/cart/items      — add item to cart (UC-04)
 * DELETE /api/cart/items/{id} — remove a single item from cart (UC-05)
 * DELETE /api/cart            — clear the entire cart
 */
@WebServlet("/api/cart/*")
public class CartServlet extends HttpServlet {

    private final CartDAO    cartDAO    = new CartDAO();
    private final ListingDAO listingDAO = new ListingDAO();

    // ------------------------------------------------------------------
    // GET /api/cart  |  GET /api/cart/count
    // ------------------------------------------------------------------

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        if (!SessionManager.isCustomer(req)) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_FORBIDDEN,
                    JsonUtil.error("Customer account required"));
            return;
        }

        String pathInfo  = req.getPathInfo();
        int    customerId = SessionManager.getUserId(req);

        // GET /api/cart/count — lightweight count only, used for navbar badge
        if ("/count".equals(pathInfo)) {
            try {
                int count = cartDAO.getItemCount(customerId);
                Map<String, Object> data = new HashMap<>();
                data.put("count", count);
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(data));
            } catch (SQLException e) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                        JsonUtil.error("Database error: " + e.getMessage()));
            }
            return;
        }

        // GET /api/cart — full cart with items
        try {
            Cart cart      = cartDAO.getOrCreateCart(customerId);
            int  itemCount = cartDAO.getItemCount(customerId);

            Map<String, Object> data = new HashMap<>();
            data.put("cart",      cart);
            data.put("itemCount", itemCount);

            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(data));

        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }

    // ------------------------------------------------------------------
    // POST /api/cart/items — add item
    // ------------------------------------------------------------------

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        if (!SessionManager.isCustomer(req)) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_FORBIDDEN,
                    JsonUtil.error("Customer account required"));
            return;
        }

        String pathInfo = req.getPathInfo();
        if (!"/items".equals(pathInfo)) {
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
            Number listingIdNum = (Number) body.get("listingId");
            Number quantityNum  = (Number) body.get("quantity");

            if (listingIdNum == null || quantityNum == null) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                        JsonUtil.error("listingId and quantity are required"));
                return;
            }

            int listingId = listingIdNum.intValue();
            int quantity  = quantityNum.intValue();

            if (quantity <= 0) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                        JsonUtil.error("Quantity must be at least 1"));
                return;
            }

            if (!listingDAO.hasStock(listingId, quantity)) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_CONFLICT,
                        JsonUtil.error("Insufficient stock for the requested quantity"));
                return;
            }

            int customerId = SessionManager.getUserId(req);
            cartDAO.addItem(customerId, listingId, quantity);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_CREATED, JsonUtil.ok());

        } catch (ClassCastException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Invalid field type in request body"));
        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }

    // ------------------------------------------------------------------
    // DELETE /api/cart/items/{itemId}  |  DELETE /api/cart
    // ------------------------------------------------------------------

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        if (!SessionManager.isCustomer(req)) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_FORBIDDEN,
                    JsonUtil.error("Customer account required"));
            return;
        }

        String pathInfo   = req.getPathInfo();
        int    customerId = SessionManager.getUserId(req);

        // DELETE /api/cart — clear entire cart
        if (pathInfo == null || "/".equals(pathInfo)) {
            try {
                cartDAO.clearCart(customerId);
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok());
            } catch (SQLException e) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                        JsonUtil.error("Database error: " + e.getMessage()));
            }
            return;
        }

        // DELETE /api/cart/items/{itemId}
        if (pathInfo.startsWith("/items/")) {
            String idStr = pathInfo.substring("/items/".length());
            try {
                int cartItemId = Integer.parseInt(idStr);
                cartDAO.removeItem(customerId, cartItemId);
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok());
            } catch (NumberFormatException e) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                        JsonUtil.error("Invalid cart item ID"));
            } catch (SQLException e) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                        JsonUtil.error("Database error: " + e.getMessage()));
            }
            return;
        }

        JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, JsonUtil.error("Not found"));
    }
}
