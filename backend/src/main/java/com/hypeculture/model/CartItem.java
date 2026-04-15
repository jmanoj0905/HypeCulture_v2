package com.hypeculture.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * A single line item inside a customer's shopping cart.
 * Maps to the {@code cart_items} table.
 *
 * Each CartItem references a {@link Listing} (the specific seller offer)
 * and records the quantity the customer wants to purchase.
 */
public class CartItem {

    private int           cartItemId;
    private int           cartId;
    private Listing       listing;
    private int           quantity;
    private LocalDateTime addedAt;

    public CartItem() {}

    public CartItem(int cartItemId, int cartId, Listing listing,
                    int quantity, LocalDateTime addedAt) {
        this.cartItemId = cartItemId;
        this.cartId     = cartId;
        this.listing    = listing;
        this.quantity   = quantity;
        this.addedAt    = addedAt;
    }

    // ------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------

    public int           getCartItemId() { return cartItemId; }
    public int           getCartId()     { return cartId; }
    public Listing       getListing()    { return listing; }
    public int           getQuantity()   { return quantity; }
    public LocalDateTime getAddedAt()    { return addedAt; }

    // ------------------------------------------------------------------
    // Setters
    // ------------------------------------------------------------------

    public void setCartItemId(int cartItemId)         { this.cartItemId = cartItemId; }
    public void setCartId(int cartId)                 { this.cartId     = cartId; }
    public void setListing(Listing listing)           { this.listing    = listing; }
    public void setQuantity(int quantity)             { this.quantity   = quantity; }
    public void setAddedAt(LocalDateTime addedAt)     { this.addedAt    = addedAt; }

    // ------------------------------------------------------------------
    // Derived helpers
    // ------------------------------------------------------------------

    /**
     * Line total = listing price × quantity.
     * Returns BigDecimal.ZERO if the listing or its price is null.
     */
    public BigDecimal getLineTotal() {
        if (listing == null || listing.getPrice() == null) {
            return BigDecimal.ZERO;
        }
        return listing.getPrice().multiply(BigDecimal.valueOf(quantity));
    }

    @Override
    public String toString() {
        return "CartItem{id=" + cartItemId
                + ", listing=" + (listing != null ? listing.getListingId() : "null")
                + ", qty=" + quantity
                + ", lineTotal=" + getLineTotal() + '}';
    }
}
