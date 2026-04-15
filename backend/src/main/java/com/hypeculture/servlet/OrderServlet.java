package com.hypeculture.servlet;

import com.hypeculture.dao.OrderDAO;
import com.hypeculture.model.Order;
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
 * Handles order endpoints.
 *
 * POST /api/orders       — checkout: create order from cart (UC-06)
 * GET  /api/orders       — order history for logged-in customer (UC-07)
 * GET  /api/orders/{id}  — single order detail
 */
@WebServlet("/api/orders/*")
public class OrderServlet extends HttpServlet {

    private final OrderDAO orderDAO = new OrderDAO();

    // ------------------------------------------------------------------
    // GET /api/orders  |  GET /api/orders/{id}
    // ------------------------------------------------------------------

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        if (!SessionManager.isCustomer(req)) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_FORBIDDEN,
                    JsonUtil.error("Customer account required"));
            return;
        }

        String pathInfo    = req.getPathInfo();
        int    customerId  = SessionManager.getUserId(req);

        // GET /api/orders/{id}
        if (pathInfo != null && pathInfo.length() > 1) {
            String[] parts = pathInfo.split("/");
            if (parts.length == 2) {
                handleGetById(parts[1], customerId, resp);
                return;
            }
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                    JsonUtil.error("Not found"));
            return;
        }

        // GET /api/orders — full history
        try {
            List<Order> orders = orderDAO.findByCustomer(customerId);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(orders));
        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }

    private void handleGetById(String idStr, int customerId,
                                HttpServletResponse resp) throws IOException {
        try {
            int orderId = Integer.parseInt(idStr);
            Order order = orderDAO.findById(orderId);

            if (order == null) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                        JsonUtil.error("Order not found"));
                return;
            }
            // Customers may only view their own orders
            if (order.getCustomerId() != customerId) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_FORBIDDEN,
                        JsonUtil.error("Access denied"));
                return;
            }
            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(order));

        } catch (NumberFormatException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Invalid order ID"));
        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }

    // ------------------------------------------------------------------
    // POST /api/orders — checkout
    // ------------------------------------------------------------------

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        if (!SessionManager.isCustomer(req)) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_FORBIDDEN,
                    JsonUtil.error("Customer account required"));
            return;
        }

        Map<?, ?> body = JsonUtil.fromJson(req.getReader(), Map.class);
        if (body == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Request body required"));
            return;
        }

        try {
            String shippingAddress = (String) body.get("shippingAddress");
            String shippingCity    = (String) body.get("shippingCity");
            String shippingState   = (String) body.get("shippingState");
            String shippingZip     = (String) body.get("shippingZip");
            String paymentStr      = (String) body.get("paymentMethod");

            if (shippingAddress == null || shippingCity == null
                    || shippingState == null || shippingZip == null
                    || paymentStr == null) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                        JsonUtil.error("shippingAddress, shippingCity, shippingState, " +
                                       "shippingZip, and paymentMethod are required"));
                return;
            }

            Order.PaymentMethod paymentMethod;
            try {
                paymentMethod = Order.PaymentMethod.valueOf(paymentStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                        JsonUtil.error("Invalid paymentMethod value"));
                return;
            }

            int customerId = SessionManager.getUserId(req);
            Order order = orderDAO.createOrder(
                    customerId,
                    shippingAddress, shippingCity, shippingState, shippingZip,
                    paymentMethod
            );

            JsonUtil.sendJson(resp, HttpServletResponse.SC_CREATED, JsonUtil.ok(order));

        } catch (OrderDAO.OrderCreationException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_CONFLICT,
                    JsonUtil.error(e.getMessage()));
        } catch (ClassCastException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Invalid field type in request body"));
        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }
}
