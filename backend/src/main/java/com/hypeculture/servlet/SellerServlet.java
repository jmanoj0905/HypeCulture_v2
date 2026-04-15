package com.hypeculture.servlet;

import com.hypeculture.dao.ListingDAO;
import com.hypeculture.dao.UserDAO;
import com.hypeculture.model.Listing;
import com.hypeculture.model.User;
import com.hypeculture.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Handles public seller profile endpoints.
 *
 * GET /api/sellers/{id}          — seller profile (username, rating, verified)
 * GET /api/sellers/{id}/listings — active listings for a seller (UC-03)
 */
public class SellerServlet extends HttpServlet {

    private final UserDAO    userDAO    = new UserDAO();
    private final ListingDAO listingDAO = new ListingDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String pathInfo = req.getPathInfo();

        if (pathInfo == null || pathInfo.length() <= 1) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Seller ID required"));
            return;
        }

        // Split: ["", "{id}"]  or  ["", "{id}", "listings"]
        String[] parts = pathInfo.split("/");

        try {
            int sellerId = Integer.parseInt(parts[1]);

            // GET /api/sellers/{id}/listings
            if (parts.length == 3 && "listings".equals(parts[2])) {
                List<Listing> listings = listingDAO.findActiveListingsBySeller(sellerId);
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(listings));
                return;
            }

            // GET /api/sellers/{id}
            if (parts.length == 2) {
                User user = userDAO.findById(sellerId);

                if (user == null || user.getRole() != User.Role.SELLER) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                            JsonUtil.error("Seller not found"));
                    return;
                }

                com.hypeculture.model.Seller seller = (com.hypeculture.model.Seller) user;

                Map<String, Object> profile = new HashMap<>();
                profile.put("userId",       seller.getUserId());
                profile.put("username",     seller.getUsername());
                profile.put("sellerRating", seller.getSellerRating());
                profile.put("totalSales",   seller.getTotalSales());
                profile.put("isVerified",   seller.isVerified());

                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, JsonUtil.ok(profile));
                return;
            }

            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                    JsonUtil.error("Not found"));

        } catch (NumberFormatException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("Invalid seller ID"));
        } catch (SQLException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    JsonUtil.error("Database error: " + e.getMessage()));
        }
    }
}
