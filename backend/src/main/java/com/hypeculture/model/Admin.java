package com.hypeculture.model;

import java.time.LocalDateTime;

/**
 * A platform administrator.
 * Extends {@link User} with an admin privilege level.
 *
 * admin_level 1 — standard admin (user/catalog management)
 * admin_level 2 — super admin  (can manage other admins)
 */
public class Admin extends User {

    private int adminLevel;

    public Admin() {
        super();
        setRole(Role.ADMIN);
        this.adminLevel = 1;
    }

    public Admin(int userId, String username, String email,
                 String passwordHash, Status status, LocalDateTime createdAt,
                 int adminLevel) {
        super(userId, username, email, passwordHash, Role.ADMIN, status, createdAt);
        this.adminLevel = adminLevel;
    }

    // ------------------------------------------------------------------
    // Getters / Setters
    // ------------------------------------------------------------------

    public int  getAdminLevel()            { return adminLevel; }
    public void setAdminLevel(int level)   { this.adminLevel = level; }

    public boolean isSuperAdmin() {
        return adminLevel >= 2;
    }
}
