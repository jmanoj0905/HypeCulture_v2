package com.hypeculture.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * A seller's offer for a specific product on the marketplace.
 * Maps to the {@code listings} table.
 *
 * A Listing binds a {@link Product} (what) to a {@link Seller} (who)
 * and adds the commercial terms: size, condition, price, and stock.
 * Multiple sellers can have listings for the same Product.
 */
public class Listing {

    public enum Condition { NEW, USED }

    public enum Status { ACTIVE, INACTIVE, SOLD_OUT }

    private int           listingId;
    private Product       product;
    private Seller        seller;
    private double        size;
    private Condition     condition;
    private BigDecimal    price;
    private int           stockQuantity;
    private Status        status;
    private String        description;
    private String        imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Listing() {}

    public Listing(int listingId, Product product, Seller seller,
                   double size, Condition condition, BigDecimal price,
                   int stockQuantity, Status status, String description,
                   String imageUrl, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.listingId     = listingId;
        this.product       = product;
        this.seller        = seller;
        this.size          = size;
        this.condition     = condition;
        this.price         = price;
        this.stockQuantity = stockQuantity;
        this.status        = status;
        this.description   = description;
        this.imageUrl      = imageUrl;
        this.createdAt     = createdAt;
        this.updatedAt     = updatedAt;
    }

    // ------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------

    public int           getListingId()     { return listingId; }
    public Product       getProduct()       { return product; }
    public Seller        getSeller()        { return seller; }
    public double        getSize()          { return size; }
    public Condition     getCondition()     { return condition; }
    public BigDecimal    getPrice()         { return price; }
    public int           getStockQuantity() { return stockQuantity; }
    public Status        getStatus()        { return status; }
    public String        getDescription()   { return description; }
    public String        getImageUrl()      { return imageUrl; }
    public LocalDateTime getCreatedAt()     { return createdAt; }
    public LocalDateTime getUpdatedAt()     { return updatedAt; }

    // ------------------------------------------------------------------
    // Setters
    // ------------------------------------------------------------------

    public void setListingId(int listingId)              { this.listingId     = listingId; }
    public void setProduct(Product product)              { this.product       = product; }
    public void setSeller(Seller seller)                 { this.seller        = seller; }
    public void setSize(double size)                     { this.size          = size; }
    public void setCondition(Condition condition)        { this.condition     = condition; }
    public void setPrice(BigDecimal price)               { this.price         = price; }
    public void setStockQuantity(int stockQuantity)      { this.stockQuantity = stockQuantity; }
    public void setStatus(Status status)                 { this.status        = status; }
    public void setDescription(String description)       { this.description   = description; }
    public void setImageUrl(String imageUrl)             { this.imageUrl      = imageUrl; }
    public void setCreatedAt(LocalDateTime createdAt)    { this.createdAt     = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt)    { this.updatedAt     = updatedAt; }

    // ------------------------------------------------------------------
    // Derived helpers
    // ------------------------------------------------------------------

    /** True only when the listing is ACTIVE and has stock remaining. */
    public boolean isAvailable() {
        return Status.ACTIVE.equals(status) && stockQuantity > 0;
    }

    /**
     * Returns a human-readable size string, e.g. "10.0" or "9.5".
     * Trims the decimal when it is a whole number: 10.0 → "10".
     */
    public String getDisplaySize() {
        if (size == Math.floor(size)) {
            return String.valueOf((int) size);
        }
        return String.valueOf(size);
    }

    /**
     * Returns the price formatted to two decimal places, e.g. "$120.00".
     */
    public String getDisplayPrice() {
        return "$" + (price != null ? price.toPlainString() : "0.00");
    }

    @Override
    public String toString() {
        return "Listing{id=" + listingId
                + ", product=" + (product != null ? product.getFullName() : "null")
                + ", seller=" + (seller != null ? seller.getUsername() : "null")
                + ", size=" + getDisplaySize()
                + ", condition=" + condition
                + ", price=" + getDisplayPrice()
                + ", stock=" + stockQuantity
                + ", status=" + status + '}';
    }
}
