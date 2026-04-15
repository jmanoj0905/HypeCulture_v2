package com.hypeculture.servlet;

import com.hypeculture.dao.ProductDAO;
import com.hypeculture.model.Product;
import com.hypeculture.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

/**
 * Handles product catalog endpoints (customer-facing browse + search).
 *
 * GET /api/products               — all active products
 * GET /api/products?categoryId=N  — products filtered by category (UC-02)
 * GET /api/products?search=query  — keyword search across name/brand/model
 * GET /api/products/{id}          — single product by ID
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
}
