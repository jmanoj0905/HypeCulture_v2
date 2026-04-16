package com.hypeculture.filter;

import com.hypeculture.util.JsonUtil;
import com.hypeculture.util.SessionManager;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Set;

/**
 * Protects all /api/* endpoints except /api/auth/* and public read endpoints.
 *
 * Public endpoints (no auth required):
 * - GET /api/products/*
 * - GET /api/categories/*
 * - GET /api/listings (public browse)
 *
 * Unauthenticated requests to protected endpoints receive 401.
 * Role-based checks (ADMIN, SELLER) are done in each servlet individually.
 */
public class AuthFilter implements Filter {

private static final Set<String> PUBLIC_READ_ROUTES = Set.of(
            "/api/products",
            "/api/categories",
            "/api/listings",
            "/api/auth",
            "/api/cart"
    );

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest  req  = (HttpServletRequest)  request;
        HttpServletResponse resp = (HttpServletResponse) response;

        String path = req.getServletPath();
        String method = req.getMethod();

        // /api/auth/* is public — skip auth check
        if (path.startsWith("/api/auth")) {
            chain.doFilter(request, response);
            return;
        }

        // Public read-only endpoints: GET requests to products, categories, listings
        if ("GET".equalsIgnoreCase(method) && isPublicReadEndpoint(path)) {
            chain.doFilter(request, response);
            return;
        }

        // All other /api/* routes require an active session
        // DEV MODE: Skip auth check for development
        String devMode = System.getenv("DEV_MODE");
        if (!"true".equals(devMode) && !SessionManager.isLoggedIn(req)) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_UNAUTHORIZED,
                    JsonUtil.error("Authentication required"));
            return;
        }

        chain.doFilter(request, response);
    }

    private boolean isPublicReadEndpoint(String path) {
        for (String publicRoute : PUBLIC_READ_ROUTES) {
            if (path.startsWith(publicRoute) || path.equals(publicRoute.substring(0, publicRoute.length() - 1))) {
                return true;
            }
        }
        return path.startsWith("/api/products") || path.startsWith("/api/categories")
                || path.startsWith("/api/listings");
    }

    @Override
    public void init(FilterConfig config) {}

    @Override
    public void destroy() {}
}
