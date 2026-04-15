package com.hypeculture.model;

import java.math.BigDecimal;

/**
 * A single line item within a completed order.
 * Maps to the {@code order_items} table.
 *
 * Captures the listing reference and the price at the moment of
 * purchase — critical for order history accuracy even if the
 * seller later changes their listing price.
 */
public class OrderItem {

    private int        orderItemId;
    private int        orderId;
    private Listing    listing;
    private int        quantity;
    private BigDecimal priceAtPurchase;

    public OrderItem() {}

    public OrderItem(int orderItemId, int orderId, Listing listing,
                     int quantity, BigDecimal priceAtPurchase) {
        this.orderItemId      = orderItemId;
        this.orderId          = orderId;
        this.listing          = listing;
        this.quantity         = quantity;
        this.priceAtPurchase  = priceAtPurchase;
    }

    // ------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------

    public int        getOrderItemId()     { return orderItemId; }
    public int        getOrderId()         { return orderId; }
    public Listing    getListing()         { return listing; }
    public int        getQuantity()        { return quantity; }
    public BigDecimal getPriceAtPurchase() { return priceAtPurchase; }

    // ------------------------------------------------------------------
    // Setters
    // ------------------------------------------------------------------

    public void setOrderItemId(int orderItemId)              { this.orderItemId     = orderItemId; }
    public void setOrderId(int orderId)                      { this.orderId         = orderId; }
    public void setListing(Listing listing)                  { this.listing         = listing; }
    public void setQuantity(int quantity)                    { this.quantity        = quantity; }
    public void setPriceAtPurchase(BigDecimal price)         { this.priceAtPurchase = price; }

    // ------------------------------------------------------------------
    // Derived helpers
    // ------------------------------------------------------------------

    /**
     * Line total using the locked-in purchase price, not the current listing price.
     */
    public BigDecimal getLineTotal() {
        if (priceAtPurchase == null) return BigDecimal.ZERO;
        return priceAtPurchase.multiply(BigDecimal.valueOf(quantity));
    }

    @Override
    public String toString() {
        return "OrderItem{id=" + orderItemId
                + ", listingId=" + (listing != null ? listing.getListingId() : "null")
                + ", qty=" + quantity
                + ", priceAtPurchase=" + priceAtPurchase
                + ", lineTotal=" + getLineTotal() + '}';
    }
}
