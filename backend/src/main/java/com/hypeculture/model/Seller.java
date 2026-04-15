package com.hypeculture.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * A verified or unverified seller on the marketplace.
 * Extends {@link User} with seller performance fields.
 */
public class Seller extends User {

    private BigDecimal sellerRating;
    private int        totalSales;
    private boolean    verified;

    public Seller() {
        super();
        setRole(Role.SELLER);
        this.sellerRating = BigDecimal.ZERO;
        this.totalSales   = 0;
        this.verified     = false;
    }

    public Seller(int userId, String username, String email,
                  String passwordHash, Status status, LocalDateTime createdAt,
                  BigDecimal sellerRating, int totalSales, boolean verified) {
        super(userId, username, email, passwordHash, Role.SELLER, status, createdAt);
        this.sellerRating = sellerRating;
        this.totalSales   = totalSales;
        this.verified     = verified;
    }

    // ------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------

    public BigDecimal getSellerRating() { return sellerRating; }
    public int        getTotalSales()   { return totalSales; }
    public boolean    isVerified()      { return verified; }

    // ------------------------------------------------------------------
    // Setters
    // ------------------------------------------------------------------

    public void setSellerRating(BigDecimal sellerRating) { this.sellerRating = sellerRating; }
    public void setTotalSales(int totalSales)             { this.totalSales   = totalSales; }
    public void setVerified(boolean verified)             { this.verified     = verified; }

    /**
     * Returns a display string for the seller's rating, e.g. "4.8 / 5.0".
     * Returns "No ratings yet" if rating is zero.
     */
    public String getDisplayRating() {
        if (sellerRating == null || sellerRating.compareTo(BigDecimal.ZERO) == 0) {
            return "No ratings yet";
        }
        return sellerRating.toPlainString() + " / 5.0";
    }
}
