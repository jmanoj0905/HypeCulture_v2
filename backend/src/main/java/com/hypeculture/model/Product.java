package com.hypeculture.model;

import java.time.LocalDateTime;

/**
 * A master shoe model in the admin-managed product catalog.
 * Maps to the {@code products} table.
 *
 * Products are catalog entries — they define what shoe exists.
 * Sellers create {@link Listing}s against a Product to set price,
 * condition, size, and stock.
 */
public class Product {

    private int           productId;
    private String        shoeName;
    private String        brand;
    private String        model;
    private Category      category;
    private String        description;
    private String        imageUrl;
    private boolean       active;
    private LocalDateTime createdAt;
    private int           lowestPrice;
    private int           listingCount;

    public Product() {}

    public Product(int productId, String shoeName, String brand, String model,
                   Category category, String description, String imageUrl,
                   boolean active, LocalDateTime createdAt) {
        this(productId, shoeName, brand, model, category, description,
            imageUrl, active, createdAt, 0, 0);
    }

    public Product(int productId, String shoeName, String brand, String model,
                   Category category, String description, String imageUrl,
                   boolean active, LocalDateTime createdAt,
                   int lowestPrice, int listingCount) {
        this.productId   = productId;
        this.shoeName    = shoeName;
        this.brand       = brand;
        this.model       = model;
        this.category    = category;
        this.description = description;
        this.imageUrl    = imageUrl;
        this.active      = active;
        this.createdAt   = createdAt;
        this.lowestPrice = lowestPrice;
        this.listingCount = listingCount;
    }

    // ------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------

    public int           getProductId()   { return productId; }
    public String        getShoeName()    { return shoeName; }
    public String        getBrand()       { return brand; }
    public String        getModel()       { return model; }
    public Category      getCategory()    { return category; }
    public String        getDescription() { return description; }
    public String        getImageUrl()    { return imageUrl; }
    public boolean       isActive()       { return active; }
    public LocalDateTime getCreatedAt()   { return createdAt; }
    public int           getLowestPrice() { return lowestPrice; }
    public int           getListingCount() { return listingCount; }

    // ------------------------------------------------------------------
    // Setters
    // ------------------------------------------------------------------

    public void setProductId(int productId)          { this.productId   = productId; }
    public void setShoeName(String shoeName)          { this.shoeName    = shoeName; }
    public void setBrand(String brand)                { this.brand       = brand; }
    public void setModel(String model)                { this.model       = model; }
    public void setCategory(Category category)        { this.category    = category; }
    public void setDescription(String description)    { this.description = description; }
    public void setImageUrl(String imageUrl)          { this.imageUrl    = imageUrl; }
    public void setActive(boolean active)             { this.active      = active; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt   = createdAt; }
    public void setLowestPrice(int lowestPrice)         { this.lowestPrice = lowestPrice; }
    public void setListingCount(int listingCount)     { this.listingCount = listingCount; }

    /**
     * Returns "Brand Model" — e.g. "Nike Air Force 1 Low 07".
     * Used for display headings and search result labels.
     */
    public String getFullName() {
        return brand + " " + shoeName;
    }

    @Override
    public String toString() {
        return "Product{id=" + productId
                + ", name='" + getFullName() + '\''
                + ", category=" + (category != null ? category.getCategoryName() : "null")
                + ", active=" + active + '}';
    }
}
