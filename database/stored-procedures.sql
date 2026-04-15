-- =============================================================
-- HypeCulture — Stored Procedures
-- MySQL 8.0+
-- =============================================================

USE hypeculture_db;

DELIMITER $$

-- =============================================================
-- SP 1: AuthenticateUser
--
-- Validates email + password_hash match and user is ACTIVE.
-- Returns the full user row on success, empty result on failure.
-- The servlet layer does the hash comparison; this proc just
-- fetches the row for a given email so the DAO can verify.
-- =============================================================
DROP PROCEDURE IF EXISTS AuthenticateUser $$
CREATE PROCEDURE AuthenticateUser(
    IN  p_email VARCHAR(100)
)
BEGIN
    SELECT
        user_id,
        username,
        email,
        password_hash,
        role,
        status,
        created_at,
        shipping_address,
        city,
        state,
        zip_code,
        seller_rating,
        total_sales,
        is_verified,
        admin_level
    FROM users
    WHERE email  = p_email
      AND status = 'ACTIVE'
    LIMIT 1;
END $$

-- =============================================================
-- SP 2: CreateOrder
--
-- Atomically creates an order and its line items from the
-- customer's current cart contents.
--
-- Steps:
--   1. Validate cart is non-empty
--   2. Validate every cart item still has sufficient stock
--   3. Insert into orders
--   4. Insert into order_items (capturing price_at_purchase)
--   5. Return the new order_id and total
--
-- Stock decrement and cart clearing are handled by triggers
-- (see triggers.sql) that fire on order_items INSERT.
-- =============================================================
DROP PROCEDURE IF EXISTS CreateOrder $$
CREATE PROCEDURE CreateOrder(
    IN  p_customer_id      INT,
    IN  p_shipping_address VARCHAR(255),
    IN  p_shipping_city    VARCHAR(100),
    IN  p_shipping_state   VARCHAR(100),
    IN  p_shipping_zip     VARCHAR(20),
    IN  p_payment_method   VARCHAR(20),
    OUT p_order_id         INT,
    OUT p_total_amount     DECIMAL(10,2),
    OUT p_error_message    VARCHAR(500)
)
sp_label: BEGIN
    DECLARE v_cart_id        INT DEFAULT NULL;
    DECLARE v_item_count     INT DEFAULT 0;
    DECLARE v_calc_total     DECIMAL(10,2) DEFAULT 0.00;
    DECLARE v_stock_ok       INT DEFAULT 1;
    DECLARE v_bad_listing    INT DEFAULT NULL;

    -- Trap any SQL error and roll back
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_error_message = 'Database error during order creation';
    END;

    -- Initialise out-params so they always have a value
    SET p_order_id      = NULL;
    SET p_total_amount  = 0.00;
    SET p_error_message = NULL;

    START TRANSACTION;

    -- 1. Resolve the customer's cart
    SELECT cart_id INTO v_cart_id
    FROM carts
    WHERE customer_id = p_customer_id
    LIMIT 1;

    IF v_cart_id IS NULL THEN
        SET p_error_message = 'No cart found for customer';
        ROLLBACK;
        LEAVE sp_label;  -- jump out; handled below via p_error_message check
    END IF;

    -- 2. Count items
    SELECT COUNT(*) INTO v_item_count
    FROM cart_items
    WHERE cart_id = v_cart_id;

    IF v_item_count = 0 THEN
        SET p_error_message = 'Cart is empty';
        ROLLBACK;
        LEAVE sp_label;
    END IF;

    -- 3. Stock validation: find any listing where requested qty > available stock
    SELECT ci.listing_id INTO v_bad_listing
    FROM cart_items ci
    JOIN listings   l  ON l.listing_id = ci.listing_id
    WHERE ci.cart_id        = v_cart_id
      AND ci.quantity        > l.stock_quantity
      AND l.status           = 'ACTIVE'
    LIMIT 1;

    IF v_bad_listing IS NOT NULL THEN
        SET p_error_message = CONCAT('Insufficient stock for listing_id=', v_bad_listing);
        ROLLBACK;
        LEAVE sp_label;
    END IF;

    -- 4. Calculate total
    SELECT SUM(ci.quantity * l.price) INTO v_calc_total
    FROM cart_items ci
    JOIN listings   l ON l.listing_id = ci.listing_id
    WHERE ci.cart_id = v_cart_id;

    -- 5. Insert order header
    INSERT INTO orders (
        customer_id,
        shipping_address,
        shipping_city,
        shipping_state,
        shipping_zip,
        payment_method,
        total_amount,
        status
    ) VALUES (
        p_customer_id,
        p_shipping_address,
        p_shipping_city,
        p_shipping_state,
        p_shipping_zip,
        p_payment_method,
        v_calc_total,
        'PLACED'
    );

    SET p_order_id     = LAST_INSERT_ID();
    SET p_total_amount = v_calc_total;

    -- 6. Insert order line items (triggers handle stock decrement + cart clear)
    INSERT INTO order_items (order_id, listing_id, quantity, price_at_purchase)
    SELECT p_order_id, ci.listing_id, ci.quantity, l.price
    FROM cart_items ci
    JOIN listings   l ON l.listing_id = ci.listing_id
    WHERE ci.cart_id = v_cart_id;

    COMMIT;
END $$

-- =============================================================
-- SP 3: UpdateListingInventory
--
-- Seller updates price and/or stock on a listing they own.
-- Validates ownership and prevents negative stock.
-- Returns updated row on success, sets p_error_message on fail.
-- =============================================================
DROP PROCEDURE IF EXISTS UpdateListingInventory $$
CREATE PROCEDURE UpdateListingInventory(
    IN  p_listing_id    INT,
    IN  p_seller_id     INT,
    IN  p_new_price     DECIMAL(10,2),
    IN  p_new_stock     INT,
    OUT p_error_message VARCHAR(500)
)
sp_label: BEGIN
    DECLARE v_owner_id INT DEFAULT NULL;

    SET p_error_message = NULL;

    -- Ownership check
    SELECT seller_id INTO v_owner_id
    FROM listings
    WHERE listing_id = p_listing_id
    LIMIT 1;

    IF v_owner_id IS NULL THEN
        SET p_error_message = 'Listing not found';
        LEAVE sp_label;
    END IF;

    IF v_owner_id != p_seller_id THEN
        SET p_error_message = 'Forbidden: listing belongs to another seller';
        LEAVE sp_label;
    END IF;

    IF p_new_price <= 0 THEN
        SET p_error_message = 'Price must be greater than zero';
        LEAVE sp_label;
    END IF;

    IF p_new_stock < 0 THEN
        SET p_error_message = 'Stock cannot be negative';
        LEAVE sp_label;
    END IF;

    -- Apply update (trigger handles SOLD_OUT status when stock hits 0)
    UPDATE listings
    SET price          = p_new_price,
        stock_quantity = p_new_stock,
        updated_at     = CURRENT_TIMESTAMP
    WHERE listing_id = p_listing_id;

END $$

-- =============================================================
-- SP 4: SoftDeleteListing
--
-- Marks a listing INACTIVE (soft delete).
-- Blocks removal if the listing has PLACED or SHIPPED orders.
-- =============================================================
DROP PROCEDURE IF EXISTS SoftDeleteListing $$
CREATE PROCEDURE SoftDeleteListing(
    IN  p_listing_id    INT,
    IN  p_seller_id     INT,
    OUT p_error_message VARCHAR(500)
)
sp_label: BEGIN
    DECLARE v_owner_id     INT     DEFAULT NULL;
    DECLARE v_active_orders INT    DEFAULT 0;

    SET p_error_message = NULL;

    SELECT seller_id INTO v_owner_id
    FROM listings
    WHERE listing_id = p_listing_id
    LIMIT 1;

    IF v_owner_id IS NULL THEN
        SET p_error_message = 'Listing not found';
        LEAVE sp_label;
    END IF;

    IF v_owner_id != p_seller_id THEN
        SET p_error_message = 'Forbidden: listing belongs to another seller';
        LEAVE sp_label;
    END IF;

    -- Block if there are unfulfilled orders against this listing
    SELECT COUNT(*) INTO v_active_orders
    FROM order_items oi
    JOIN orders      o  ON o.order_id = oi.order_id
    WHERE oi.listing_id = p_listing_id
      AND o.status IN ('PLACED', 'SHIPPED');

    IF v_active_orders > 0 THEN
        SET p_error_message = CONCAT(
            'Cannot remove listing: ',
            v_active_orders,
            ' active order(s) still in progress'
        );
        LEAVE sp_label;
    END IF;

    UPDATE listings
    SET status     = 'INACTIVE',
        updated_at = CURRENT_TIMESTAMP
    WHERE listing_id = p_listing_id;

END $$

-- =============================================================
-- SP 5: GetSalesSummary  (used by ReportDAO)
--
-- Aggregate sales totals grouped by category and date range.
-- =============================================================
DROP PROCEDURE IF EXISTS GetSalesSummary $$
CREATE PROCEDURE GetSalesSummary(
    IN p_date_from DATE,
    IN p_date_to   DATE
)
BEGIN
    SELECT
        c.category_name,
        COUNT(DISTINCT o.order_id)   AS total_orders,
        SUM(oi.quantity)             AS units_sold,
        SUM(oi.quantity * oi.price_at_purchase) AS revenue
    FROM order_items oi
    JOIN orders   o  ON o.order_id   = oi.order_id
    JOIN listings l  ON l.listing_id = oi.listing_id
    JOIN products p  ON p.product_id = l.product_id
    JOIN categories c ON c.category_id = p.category_id
    WHERE o.status    != 'CANCELLED'
      AND DATE(o.created_at) BETWEEN p_date_from AND p_date_to
    GROUP BY c.category_id, c.category_name
    ORDER BY revenue DESC;
END $$

-- =============================================================
-- SP 6: GetSellerPerformance  (used by ReportDAO)
-- =============================================================
DROP PROCEDURE IF EXISTS GetSellerPerformance $$
CREATE PROCEDURE GetSellerPerformance(
    IN p_date_from DATE,
    IN p_date_to   DATE
)
BEGIN
    SELECT
        u.user_id                    AS seller_id,
        u.username                   AS seller_name,
        COUNT(DISTINCT o.order_id)   AS total_orders,
        SUM(oi.quantity)             AS units_sold,
        SUM(oi.quantity * oi.price_at_purchase) AS revenue,
        u.seller_rating
    FROM order_items oi
    JOIN orders   o  ON o.order_id   = oi.order_id
    JOIN listings l  ON l.listing_id = oi.listing_id
    JOIN users    u  ON u.user_id    = l.seller_id
    WHERE o.status    != 'CANCELLED'
      AND DATE(o.created_at) BETWEEN p_date_from AND p_date_to
    GROUP BY u.user_id, u.username, u.seller_rating
    ORDER BY revenue DESC;
END $$

DELIMITER ;
