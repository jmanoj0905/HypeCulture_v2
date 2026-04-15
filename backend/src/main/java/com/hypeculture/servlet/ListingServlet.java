package com.hypeculture.servlet;

import com.hypeculture.dao.ListingDAO;
import com.hypeculture.dao.ProductDAO;
import com.hypeculture.model.Listing;
import com.hypeculture.model.Product;
import com.hypeculture.model.Seller;
import com.hypeculture.util.JsonUtil;
import com.hypeculture.util.SessionManager;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Handles listing endpoints.
 *
 * GET    /api/listings                — all listings (admin)
 * GET    /api/listings?categoryId=N  — by category, sorted by price (UC-02)
 * GET    /api/listings?productId=N   — by product, sorted by price (UC-03)
 * GET    /api/listings?sellerId=N    — seller's full inventory (UC-09)
 * GET    /api/listings/{id}          — single listing
 * POST   /api/listings               — create listing (SELLER, UC-08)
 * PUT    /api/listings/{id}          — update price + stock (SELLER owner, UC-09)
 * DELETE /api/listings/{id}          — soft-delete listing (SELLER owner, UC-10)
 */
public class ListingServlet extends HttpServlet {

    private final ListingDAO listingDAO = new ListingDAO();
    private final ProductDAO productDAO = new ProductDAO();

    // ------------------------------------------------------------------
    // GET
    // ------------------------------------------------------------------

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String pathInfo = req.getPathInfo();

        // GET /api/listings/{id}
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

        String categoryIdParam = req.getParameter("categoryId");
        String productIdParam  = req.getParameter("productId");
        String sellerIdParam   = req.getParameter("sellerId");

        try {
            if (categoryIdParam != null) {
                int categoryId = Integer.parseInt(categoryIdParam);
                List<Listing> listings = listingDAO.findByCategoryOrderByPrice(categoryId);
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(listings));

            } else if (productIdParam != null) {
                int productId = Integer.parseInt(productIdParam);
                List<Listing> listings = listingDAO.findByProductOrderByPrice(productId);
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(listings));

            } else if (sellerIdParam != null) {
                int sellerId = Integer.parseInt(sellerIdParam);
                List<Listing> listings = listingDAO.findBySeller(sellerId);
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(listings));

            } else {
                List<Listing> listings = listingDAO.findAll();
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(listings));
            }

        } catch (NumberFormatException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Invalid ID parameter"));
        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }

    private void handleGetById(String idStr, HttpServletResponse resp)
            throws IOException {
        try {
            int listingId = Integer.parseInt(idStr);
            Listing listing = listingDAO.findById(listingId);
            if (listing == null) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                        JsonUtil.error("Listing not found"));
                return;
            }
            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(listing));
        } catch (NumberFormatException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Invalid listing ID"));
        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }

    // ------------------------------------------------------------------
    // POST /api/listings — create listing (SELLER only)
    // ------------------------------------------------------------------

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        if (!SessionManager.isSeller(req)) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_FORBIDDEN,
                    JsonUtil.error("Seller account required"));
            return;
        }

        Map<String, Object> body = JsonUtil.fromJson(req.getReader(), Map.class);
        if (body == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Request body required"));
            return;
        }

        try {
            Number productIdNum = (Number) body.get("productId");
            Number priceNum     = (Number) body.get("price");
            Number stockNum     = (Number) body.get("stockQuantity");
            Number sizeNum      = (Number) body.get("size");
            String conditionStr = (String) body.get("condition");
            String description  = (String) body.getOrDefault("description", "");
            String imageUrl     = (String) body.getOrDefault("imageUrl", "");

            if (productIdNum == null || priceNum == null || stockNum == null
                    || sizeNum == null || conditionStr == null) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                        JsonUtil.error("productId, price, stockQuantity, size, condition are required"));
                return;
            }

            Product product = productDAO.findById(productIdNum.intValue());
            if (product == null || !product.isActive()) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                        JsonUtil.error("Product not found in catalog"));
                return;
            }

            Listing.Condition condition;
            try {
                condition = Listing.Condition.valueOf(conditionStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                        JsonUtil.error("Invalid condition value"));
                return;
            }

            int sellerId = SessionManager.getUserId(req);
            Seller seller = new Seller(sellerId, SessionManager.getUsername(req),
                    null, null, null, null, BigDecimal.ZERO, 0, false);

            Listing listing = new Listing(
                    0, product, seller,
                    sizeNum.doubleValue(),
                    condition,
                    BigDecimal.valueOf(priceNum.doubleValue()),
                    stockNum.intValue(),
                    Listing.Status.ACTIVE,
                    description, imageUrl, null, null
            );

            listingDAO.insert(listing);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_CREATED, JsonUtil.ok(listing));

        } catch (ClassCastException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Invalid field type in request body"));
        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }

    // ------------------------------------------------------------------
    // PUT /api/listings/{id} — update price + stock (SELLER, owner only)
    // ------------------------------------------------------------------

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        if (!SessionManager.isSeller(req)) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_FORBIDDEN,
                    JsonUtil.error("Seller account required"));
            return;
        }

        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Listing ID required"));
            return;
        }

        try {
            int listingId = Integer.parseInt(pathInfo.substring(1));
            int sellerId  = SessionManager.getUserId(req);

            Map<String, Object> body = JsonUtil.fromJson(req.getReader(), Map.class);
            if (body == null) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                        JsonUtil.error("Request body required"));
                return;
            }

            Number priceNum = (Number) body.get("price");
            Number stockNum = (Number) body.get("stockQuantity");

            if (priceNum == null || stockNum == null) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                        JsonUtil.error("price and stockQuantity are required"));
                return;
            }

            String error = listingDAO.updatePriceAndStock(
                    listingId, sellerId,
                    BigDecimal.valueOf(priceNum.doubleValue()),
                    stockNum.intValue()
            );

            if (error != null) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                        JsonUtil.error(error));
                return;
            }

            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok());

        } catch (NumberFormatException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Invalid listing ID"));
        } catch (ClassCastException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Invalid field type in request body"));
        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }

    // ------------------------------------------------------------------
    // DELETE /api/listings/{id} — soft-delete (SELLER, owner only)
    // ------------------------------------------------------------------

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        if (!SessionManager.isSeller(req)) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_FORBIDDEN,
                    JsonUtil.error("Seller account required"));
            return;
        }

        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Listing ID required"));
            return;
        }

        try {
            int listingId = Integer.parseInt(pathInfo.substring(1));
            int sellerId  = SessionManager.getUserId(req);

            String error = listingDAO.softDelete(listingId, sellerId);
            if (error != null) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                        JsonUtil.error(error));
                return;
            }

            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok());

        } catch (NumberFormatException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Invalid listing ID"));
        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }
}
