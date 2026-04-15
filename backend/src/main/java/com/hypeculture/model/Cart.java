package com.hypeculture.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * A customer's shopping cart — 1:1 with a Customer.
 * Maps to the {@code carts} table; items come from {@code cart_items}.
 *
 * The cart is a lightweight container: the DAO populates {@code items}
 * by joining cart_items with listings in a single query.
 */
public class Cart {

    private int            cartId;
    private int            customerId;
    private LocalDateTime  createdAt;
    private List<CartItem> items;

    public Cart() {
        this.items = new ArrayList<>();
    }

    public Cart(int cartId, int customerId, LocalDateTime createdAt) {
        this.cartId     = cartId;
        this.customerId = customerId;
        this.createdAt  = createdAt;
        this.items      = new ArrayList<>();
    }

    // ------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------

    public int            getCartId()     { return cartId; }
    public int            getCustomerId() { return customerId; }
    public LocalDateTime  getCreatedAt()  { return createdAt; }

    /** Unmodifiable view — mutate via addItem / removeItem. */
    public List<CartItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    // ------------------------------------------------------------------
    // Setters
    // ------------------------------------------------------------------

    public void setCartId(int cartId)             { this.cartId     = cartId; }
    public void setCustomerId(int customerId)      { this.customerId = customerId; }
    public void setCreatedAt(LocalDateTime dt)     { this.createdAt  = dt; }

    /** Replaces the full item list — used by the DAO after a fresh load. */
    public void setItems(List<CartItem> items) {
        this.items = items != null ? new ArrayList<>(items) : new ArrayList<>();
    }

    // ------------------------------------------------------------------
    // Item management
    // ------------------------------------------------------------------

    public void addItem(CartItem item) {
        items.add(item);
    }

    public void removeItem(int cartItemId) {
        items.removeIf(i -> i.getCartItemId() == cartItemId);
    }

    // ------------------------------------------------------------------
    // Derived helpers
    // ------------------------------------------------------------------

    public boolean isEmpty() {
        return items.isEmpty();
    }

    public int getItemCount() {
        return items.stream().mapToInt(CartItem::getQuantity).sum();
    }

    /**
     * Subtotal across all line items.
     */
    public BigDecimal getSubtotal() {
        return items.stream()
                .map(CartItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public String toString() {
        return "Cart{id=" + cartId
                + ", customerId=" + customerId
                + ", items=" + items.size()
                + ", subtotal=" + getSubtotal() + '}';
    }
}
