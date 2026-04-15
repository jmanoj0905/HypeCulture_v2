package com.hypeculture.filter;

import com.hypeculture.util.JsonUtil;
import com.hypeculture.util.SessionManager;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Protects all /api/* endpoints except /api/auth/*.
 *
 * Unauthenticated requests to protected endpoints receive 401.
 * Role-based checks (ADMIN, SELLER) are done in each servlet individually.
 */
public class AuthFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest  req  = (HttpServletRequest)  request;
        HttpServletResponse resp = (HttpServletResponse) response;

        String path = req.getServletPath();

        // /api/auth/* is public — skip auth check
        if (path.startsWith("/api/auth")) {
            chain.doFilter(request, response);
            return;
        }

        // All other /api/* routes require an active session
        if (!SessionManager.isLoggedIn(req)) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_UNAUTHORIZED,
                    JsonUtil.error("Authentication required"));
            return;
        }

        chain.doFilter(request, response);
    }

    @Override
    public void init(FilterConfig config) {}

    @Override
    public void destroy() {}
}
