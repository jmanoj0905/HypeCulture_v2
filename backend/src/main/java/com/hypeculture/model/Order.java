package com.hypeculture.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * A completed purchase by a customer.
 * Maps to the {@code orders} table; line items come from {@code order_items}.
 *
 * totalAmount is stored on the order row (captured at checkout time)
 * and should NOT be recomputed from items — prices may have changed.
 */
public class Order {

    public enum PaymentMethod { CREDIT_CARD, UPI, CASH_ON_DELIVERY }

    public enum Status { PLACED, SHIPPED, DELIVERED, CANCELLED }

    private int             orderId;
    private int             customerId;
    private String          shippingAddress;
    private String          shippingCity;
    private String          shippingState;
    private String          shippingZip;
    private PaymentMethod   paymentMethod;
    private BigDecimal      totalAmount;
    private Status          status;
    private LocalDateTime   createdAt;
    private LocalDateTime   updatedAt;
    private List<OrderItem> items;

    public Order() {
        this.items = new ArrayList<>();
    }

    public Order(int orderId, int customerId,
                 String shippingAddress, String shippingCity,
                 String shippingState, String shippingZip,
                 PaymentMethod paymentMethod, BigDecimal totalAmount,
                 Status status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.orderId         = orderId;
        this.customerId      = customerId;
        this.shippingAddress = shippingAddress;
        this.shippingCity    = shippingCity;
        this.shippingState   = shippingState;
        this.shippingZip     = shippingZip;
        this.paymentMethod   = paymentMethod;
        this.totalAmount     = totalAmount;
        this.status          = status;
        this.createdAt       = createdAt;
        this.updatedAt       = updatedAt;
        this.items           = new ArrayList<>();
    }

    // ------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------

    public int             getOrderId()         { return orderId; }
    public int             getCustomerId()       { return customerId; }
    public String          getShippingAddress()  { return shippingAddress; }
    public String          getShippingCity()     { return shippingCity; }
    public String          getShippingState()    { return shippingState; }
    public String          getShippingZip()      { return shippingZip; }
    public PaymentMethod   getPaymentMethod()    { return paymentMethod; }
    public BigDecimal      getTotalAmount()      { return totalAmount; }
    public Status          getStatus()           { return status; }
    public LocalDateTime   getCreatedAt()        { return createdAt; }
    public LocalDateTime   getUpdatedAt()        { return updatedAt; }

    /** Unmodifiable view — populated by the DAO after loading order_items. */
    public List<OrderItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    // ------------------------------------------------------------------
    // Setters
    // ------------------------------------------------------------------

    public void setOrderId(int orderId)                    { this.orderId         = orderId; }
    public void setCustomerId(int customerId)              { this.customerId      = customerId; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public void setShippingCity(String shippingCity)       { this.shippingCity    = shippingCity; }
    public void setShippingState(String shippingState)     { this.shippingState   = shippingState; }
    public void setShippingZip(String shippingZip)         { this.shippingZip     = shippingZip; }
    public void setPaymentMethod(PaymentMethod method)     { this.paymentMethod   = method; }
    public void setTotalAmount(BigDecimal totalAmount)     { this.totalAmount     = totalAmount; }
    public void setStatus(Status status)                   { this.status          = status; }
    public void setCreatedAt(LocalDateTime createdAt)      { this.createdAt       = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt)      { this.updatedAt       = updatedAt; }

    public void setItems(List<OrderItem> items) {
        this.items = items != null ? new ArrayList<>(items) : new ArrayList<>();
    }

    public void addItem(OrderItem item) {
        this.items.add(item);
    }

    // ------------------------------------------------------------------
    // Derived helpers
    // ------------------------------------------------------------------

    /**
     * Full shipping address as a single display string.
     * e.g. "12 Oak Street, Chicago, IL 60601"
     */
    public String getFormattedShippingAddress() {
        return shippingAddress + ", " + shippingCity + ", " + shippingState + " " + shippingZip;
    }

    public boolean isCancellable() {
        return Status.PLACED.equals(status);
    }

    public boolean isActive() {
        return Status.PLACED.equals(status) || Status.SHIPPED.equals(status);
    }

    @Override
    public String toString() {
        return "Order{id=" + orderId
                + ", customerId=" + customerId
                + ", status=" + status
                + ", total=" + totalAmount
                + ", items=" + items.size() + '}';
    }
}
