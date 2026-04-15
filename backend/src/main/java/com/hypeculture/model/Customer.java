package com.hypeculture.model;

import java.time.LocalDateTime;

/**
 * A registered buyer on the marketplace.
 * Extends {@link User} with shipping address fields.
 */
public class Customer extends User {

    private String shippingAddress;
    private String city;
    private String state;
    private String zipCode;

    public Customer() {
        super();
        setRole(Role.CUSTOMER);
    }

    public Customer(int userId, String username, String email,
                    String passwordHash, Status status, LocalDateTime createdAt,
                    String shippingAddress, String city, String state, String zipCode) {
        super(userId, username, email, passwordHash, Role.CUSTOMER, status, createdAt);
        this.shippingAddress = shippingAddress;
        this.city            = city;
        this.state           = state;
        this.zipCode         = zipCode;
    }

    // ------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------

    public String getShippingAddress() { return shippingAddress; }
    public String getCity()            { return city; }
    public String getState()           { return state; }
    public String getZipCode()         { return zipCode; }

    // ------------------------------------------------------------------
    // Setters
    // ------------------------------------------------------------------

    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public void setCity(String city)                       { this.city            = city; }
    public void setState(String state)                     { this.state           = state; }
    public void setZipCode(String zipCode)                 { this.zipCode         = zipCode; }

    /**
     * Returns a single-line formatted shipping address for display and order records.
     */
    public String getFormattedAddress() {
        return shippingAddress + ", " + city + ", " + state + " " + zipCode;
    }
}
