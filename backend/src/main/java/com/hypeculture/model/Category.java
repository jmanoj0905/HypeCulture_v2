package com.hypeculture.model;

/**
 * A shoe category in the master catalog.
 * Maps to the {@code categories} table.
 *
 * Examples: Sneakers, Running, Basketball, Boots, Casual
 */
public class Category {

    private int    categoryId;
    private String categoryName;
    private String description;

    public Category() {}

    public Category(int categoryId, String categoryName, String description) {
        this.categoryId   = categoryId;
        this.categoryName = categoryName;
        this.description  = description;
    }

    // ------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------

    public int    getCategoryId()   { return categoryId; }
    public String getCategoryName() { return categoryName; }
    public String getDescription()  { return description; }

    // ------------------------------------------------------------------
    // Setters
    // ------------------------------------------------------------------

    public void setCategoryId(int categoryId)      { this.categoryId   = categoryId; }
    public void setCategoryName(String name)        { this.categoryName = name; }
    public void setDescription(String description)  { this.description  = description; }

    @Override
    public String toString() {
        return "Category{id=" + categoryId + ", name='" + categoryName + "'}";
    }
}
