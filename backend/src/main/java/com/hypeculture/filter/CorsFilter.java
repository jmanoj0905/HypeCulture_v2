package com.hypeculture.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Sets CORS headers on every response so the React frontend (dev server
 * on a different port) can communicate with the API.
 *
 * Configured via the allowedOrigin init-param in web.xml (defaults to *).
 * Lock this to the actual domain in production.
 */
public class CorsFilter implements Filter {

    private String allowedOrigin;

    @Override
    public void init(FilterConfig config) {
        String origin = config.getInitParameter("allowedOrigin");
        allowedOrigin = (origin != null && !origin.isBlank()) ? origin : "*";
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest  req  = (HttpServletRequest)  request;
        HttpServletResponse resp = (HttpServletResponse) response;

        String origin = req.getHeader("Origin");
        boolean isValidOrigin = origin != null && !origin.isBlank()
                && (origin.startsWith("http://localhost:")
                    || origin.startsWith("http://127.0.0.1:"));
        String effectiveOrigin = isValidOrigin ? origin : allowedOrigin;

        resp.setHeader("Access-Control-Allow-Origin",      effectiveOrigin);
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setHeader("Access-Control-Allow-Methods",     "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers",
                       "Content-Type, Authorization, X-Requested-With");
        resp.setHeader("Access-Control-Max-Age", "3600");

        // Short-circuit OPTIONS preflight — no further processing needed
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            resp.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {}
}
