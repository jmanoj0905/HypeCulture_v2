package com.hypeculture.model;

import java.time.LocalDateTime;

/**
 * Base POJO for all system users.
 *
 * Maps to the {@code users} table which uses single-table inheritance —
 * Customer, Seller, and Admin rows all live in the same table, distinguished
 * by the {@code role} column. Subclasses add role-specific fields.
 */
public abstract class User {

    public enum Role   { CUSTOMER, SELLER, ADMIN }
    public enum Status { ACTIVE, INACTIVE }

    private int           userId;
    private String        username;
    private String        email;
    private String        passwordHash;
    private Role          role;
    private Status        status;
    private LocalDateTime createdAt;

    protected User() {}

    protected User(int userId, String username, String email,
                   String passwordHash, Role role, Status status,
                   LocalDateTime createdAt) {
        this.userId       = userId;
        this.username     = username;
        this.email        = email;
        this.passwordHash = passwordHash;
        this.role         = role;
        this.status       = status;
        this.createdAt    = createdAt;
    }

    // ------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------

    public int           getUserId()       { return userId; }
    public String        getUsername()     { return username; }
    public String        getEmail()        { return email; }
    public String        getPasswordHash() { return passwordHash; }
    public Role          getRole()         { return role; }
    public Status        getStatus()       { return status; }
    public LocalDateTime getCreatedAt()    { return createdAt; }

    // ------------------------------------------------------------------
    // Setters
    // ------------------------------------------------------------------

    public void setUserId(int userId)             { this.userId       = userId; }
    public void setUsername(String username)      { this.username     = username; }
    public void setEmail(String email)            { this.email        = email; }
    public void setPasswordHash(String hash)      { this.passwordHash = hash; }
    public void setRole(Role role)                { this.role         = role; }
    public void setStatus(Status status)          { this.status       = status; }
    public void setCreatedAt(LocalDateTime dt)    { this.createdAt    = dt; }

    // ------------------------------------------------------------------

    public boolean isActive() {
        return Status.ACTIVE.equals(this.status);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName()
                + "{id=" + userId
                + ", username='" + username + '\''
                + ", role=" + role
                + ", status=" + status + '}';
    }
}
