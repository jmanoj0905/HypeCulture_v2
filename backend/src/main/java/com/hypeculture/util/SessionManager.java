package com.hypeculture.util;

import com.hypeculture.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

/**
 * Thin wrapper around HttpSession for storing and reading auth state.
 *
 * Session attributes:
 *   userId   — int    — the logged-in user's primary key
 *   role     — String — the user's role (CUSTOMER / SELLER / ADMIN)
 *   username — String — display name
 */
public class SessionManager {

    private static final String ATTR_USER_ID  = "userId";
    private static final String ATTR_ROLE     = "role";
    private static final String ATTR_USERNAME = "username";

    private SessionManager() {}

    /**
     * Creates (or refreshes) a session and stores the user's identity.
     * Invalidates the old session first to prevent session fixation.
     */
    public static void login(HttpServletRequest req, User user) {
        HttpSession old = req.getSession(false);
        if (old != null) old.invalidate();
        HttpSession session = req.getSession(true);
        session.setAttribute(ATTR_USER_ID,  user.getUserId());
        session.setAttribute(ATTR_ROLE,     user.getRole().name());
        session.setAttribute(ATTR_USERNAME, user.getUsername());
    }

    /** Invalidates the current session, logging the user out. */
    public static void logout(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        if (session != null) session.invalidate();
    }

    /** Returns true if a valid session with a userId attribute exists. */
    public static boolean isLoggedIn(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        return session != null && session.getAttribute(ATTR_USER_ID) != null;
    }

    /** Returns the logged-in user's ID, or -1 if not authenticated. */
    public static int getUserId(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        if (session == null) return -1;
        Object id = session.getAttribute(ATTR_USER_ID);
        return id != null ? (int) id : -1;
    }

    /** Returns the logged-in user's role string (e.g. "CUSTOMER"), or null. */
    public static String getRole(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        if (session == null) return null;
        Object role = session.getAttribute(ATTR_ROLE);
        return role != null ? role.toString() : null;
    }

    /** Returns the logged-in user's username, or null. */
    public static String getUsername(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        if (session == null) return null;
        Object username = session.getAttribute(ATTR_USERNAME);
        return username != null ? username.toString() : null;
    }

    /** Convenience: checks role equals "ADMIN". */
    public static boolean isAdmin(HttpServletRequest req) {
        return "ADMIN".equals(getRole(req));
    }

    /** Convenience: checks role equals "SELLER". */
    public static boolean isSeller(HttpServletRequest req) {
        return "SELLER".equals(getRole(req));
    }

    /** Convenience: checks role equals "CUSTOMER". */
    public static boolean isCustomer(HttpServletRequest req) {
        return "CUSTOMER".equals(getRole(req));
    }
}
