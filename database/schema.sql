-- =============================================================
-- HypeCulture — Database Schema
-- MySQL 8.0+
-- Single-table inheritance for User hierarchy
-- =============================================================

CREATE DATABASE IF NOT EXISTS hypeculture_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hypeculture_db;

-- =============================================================
-- 1. CATEGORIES
-- =============================================================
CREATE TABLE IF NOT EXISTS categories (
    category_id   INT          NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(50)  NOT NULL,
    description   TEXT,
    PRIMARY KEY (category_id),
    UNIQUE KEY uq_category_name (category_name)
) ENGINE=InnoDB;

-- =============================================================
-- 2. USERS  (single-table inheritance: CUSTOMER / SELLER / ADMIN)
--
-- Customer-specific : shipping_address, city, state, zip_code
-- Seller-specific   : seller_rating, total_sales, is_verified
-- Admin-specific    : admin_level
-- Unused columns for a given role are left NULL.
-- =============================================================
CREATE TABLE IF NOT EXISTS users (
    user_id          INT            NOT NULL AUTO_INCREMENT,
    username         VARCHAR(50)    NOT NULL,
    email            VARCHAR(100)   NOT NULL,
    password_hash    VARCHAR(255)   NOT NULL,
    role             ENUM('CUSTOMER','SELLER','ADMIN') NOT NULL,
    status           ENUM('ACTIVE','INACTIVE')         NOT NULL DEFAULT 'ACTIVE',
    created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Customer fields
    shipping_address VARCHAR(255),
    city             VARCHAR(100),
    state            VARCHAR(100),
    zip_code         VARCHAR(20),

    -- Seller fields
    seller_rating    DECIMAL(3,2)   DEFAULT 0.00,
    total_sales      INT            DEFAULT 0,
    is_verified      TINYINT(1)     DEFAULT 0,

    -- Admin fields
    admin_level      INT            DEFAULT 1,

    PRIMARY KEY (user_id),
    UNIQUE KEY uq_username (username),
    UNIQUE KEY uq_email    (email),
    KEY idx_users_role     (role),
    KEY idx_users_status   (status)
) ENGINE=InnoDB;

-- =============================================================
-- 3. PRODUCTS  (master catalog — admin-managed)
-- =============================================================
CREATE TABLE IF NOT EXISTS products (
    product_id  INT          NOT NULL AUTO_INCREMENT,
    shoe_name   VARCHAR(100) NOT NULL,
    brand       VARCHAR(50)  NOT NULL,
    model       VARCHAR(100) NOT NULL,
    category_id INT          NOT NULL,
    description TEXT,
    image_url   VARCHAR(500),
    is_active   TINYINT(1)   NOT NULL DEFAULT 1,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (product_id),
    UNIQUE KEY uq_brand_model  (brand, model),
    KEY idx_products_category  (category_id),
    KEY idx_products_active    (is_active),
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories (category_id)
) ENGINE=InnoDB;

-- =============================================================
-- 4. LISTINGS  (seller offers for a product)
-- =============================================================
CREATE TABLE IF NOT EXISTS listings (
    listing_id     INT            NOT NULL AUTO_INCREMENT,
    product_id     INT            NOT NULL,
    seller_id      INT            NOT NULL,
    size           DECIMAL(4,1)   NOT NULL,
    condition_type ENUM('NEW','USED') NOT NULL,
    price          DECIMAL(10,2)  NOT NULL,
    stock_quantity INT            NOT NULL DEFAULT 0,
    status         ENUM('ACTIVE','INACTIVE','SOLD_OUT') NOT NULL DEFAULT 'ACTIVE',
    description    TEXT,
    image_url      VARCHAR(500),
    created_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (listing_id),
    KEY idx_listings_product   (product_id),
    KEY idx_listings_seller    (seller_id),
    KEY idx_listings_status    (status),
    KEY idx_listings_price     (price),
    KEY idx_listings_cat_price (product_id, price),
    CONSTRAINT fk_listings_product
        FOREIGN KEY (product_id) REFERENCES products (product_id),
    CONSTRAINT fk_listings_seller
        FOREIGN KEY (seller_id) REFERENCES users (user_id)
) ENGINE=InnoDB;

-- =============================================================
-- 5. CARTS  (1:1 with customer)
-- =============================================================
CREATE TABLE IF NOT EXISTS carts (
    cart_id     INT      NOT NULL AUTO_INCREMENT,
    customer_id INT      NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (cart_id),
    UNIQUE KEY uq_cart_customer (customer_id),
    CONSTRAINT fk_carts_customer
        FOREIGN KEY (customer_id) REFERENCES users (user_id)
) ENGINE=InnoDB;

-- =============================================================
-- 6. CART_ITEMS
-- =============================================================
CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id INT      NOT NULL AUTO_INCREMENT,
    cart_id      INT      NOT NULL,
    listing_id   INT      NOT NULL,
    quantity     INT      NOT NULL DEFAULT 1,
    added_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (cart_item_id),
    UNIQUE KEY uq_cart_listing (cart_id, listing_id),
    KEY idx_cart_items_cart    (cart_id),
    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id)    REFERENCES carts    (cart_id)    ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_listing
        FOREIGN KEY (listing_id) REFERENCES listings (listing_id)
) ENGINE=InnoDB;

-- =============================================================
-- 7. ORDERS
-- =============================================================
CREATE TABLE IF NOT EXISTS orders (
    order_id         INT          NOT NULL AUTO_INCREMENT,
    customer_id      INT          NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    shipping_city    VARCHAR(100) NOT NULL,
    shipping_state   VARCHAR(100) NOT NULL,
    shipping_zip     VARCHAR(20)  NOT NULL,
    payment_method   ENUM('CREDIT_CARD','UPI','CASH_ON_DELIVERY') NOT NULL,
    total_amount     DECIMAL(10,2) NOT NULL,
    status           ENUM('PLACED','SHIPPED','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PLACED',
    created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (order_id),
    KEY idx_orders_customer (customer_id),
    KEY idx_orders_status   (status),
    KEY idx_orders_created  (created_at),
    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id) REFERENCES users (user_id)
) ENGINE=InnoDB;

-- =============================================================
-- 8. ORDER_ITEMS
-- =============================================================
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id    INT           NOT NULL AUTO_INCREMENT,
    order_id         INT           NOT NULL,
    listing_id       INT           NOT NULL,
    quantity         INT           NOT NULL,
    price_at_purchase DECIMAL(10,2) NOT NULL,

    PRIMARY KEY (order_item_id),
    KEY idx_order_items_order   (order_id),
    KEY idx_order_items_listing (listing_id),
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id)   REFERENCES orders   (order_id),
    CONSTRAINT fk_order_items_listing
        FOREIGN KEY (listing_id) REFERENCES listings (listing_id)
) ENGINE=InnoDB;

-- =============================================================
-- 9. REVIEWS
-- =============================================================
CREATE TABLE IF NOT EXISTS reviews (
    review_id   INT      NOT NULL AUTO_INCREMENT,
    customer_id INT      NOT NULL,
    product_id  INT      NOT NULL,
    rating      INT      NOT NULL,
    title       VARCHAR(200),
    body        TEXT,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (review_id),
    UNIQUE KEY uq_customer_product (customer_id, product_id),
    KEY idx_reviews_product        (product_id),
    CONSTRAINT fk_reviews_customer
        FOREIGN KEY (customer_id) REFERENCES users    (user_id),
    CONSTRAINT fk_reviews_product
        FOREIGN KEY (product_id)  REFERENCES products (product_id),
    CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;
