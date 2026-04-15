-- =============================================================
-- HypeCulture — Triggers
-- MySQL 8.0+
-- =============================================================

USE hypeculture_db;

DELIMITER $$

-- =============================================================
-- TRIGGER 1: trg_decrement_stock_on_order
--
-- Fires AFTER INSERT on order_items.
-- Decrements stock_quantity on the purchased listing by the
-- ordered quantity.
--
-- Separate from the stored procedure so that any direct
-- order_items insert (e.g. admin tooling) also keeps stock
-- consistent automatically.
-- =============================================================
DROP TRIGGER IF EXISTS trg_decrement_stock_on_order $$
CREATE TRIGGER trg_decrement_stock_on_order
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE listings
    SET stock_quantity = stock_quantity - NEW.quantity,
        updated_at     = CURRENT_TIMESTAMP
    WHERE listing_id = NEW.listing_id;
END $$

-- =============================================================
-- TRIGGER 2: trg_mark_sold_out_on_zero_stock
--
-- Fires AFTER UPDATE on listings.
-- When stock_quantity reaches 0, automatically flips status
-- to SOLD_OUT so the listing stops appearing in browse results
-- without requiring the servlet layer to remember to do it.
-- =============================================================
DROP TRIGGER IF EXISTS trg_mark_sold_out_on_zero_stock $$
CREATE TRIGGER trg_mark_sold_out_on_zero_stock
AFTER UPDATE ON listings
FOR EACH ROW
BEGIN
    IF NEW.stock_quantity <= 0 AND OLD.stock_quantity > 0 THEN
        UPDATE listings
        SET status     = 'SOLD_OUT',
            updated_at = CURRENT_TIMESTAMP
        WHERE listing_id = NEW.listing_id;
    END IF;
END $$

-- =============================================================
-- TRIGGER 3: trg_increment_seller_sales_on_order
--
-- Fires AFTER INSERT on order_items.
-- Increments the seller's total_sales counter on the users
-- table by the quantity sold in this line item.
-- Keeps seller stats in sync without a scheduled job.
-- =============================================================
DROP TRIGGER IF EXISTS trg_increment_seller_sales_on_order $$
CREATE TRIGGER trg_increment_seller_sales_on_order
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE users
    SET total_sales = total_sales + NEW.quantity
    WHERE user_id = (
        SELECT seller_id FROM listings WHERE listing_id = NEW.listing_id
    );
END $$

-- =============================================================
-- TRIGGER 4: trg_clear_cart_on_order
--
-- Fires AFTER INSERT on orders.
-- Deletes all cart_items for the customer whose order was just
-- created, then removes the cart row itself so a fresh cart
-- is created on the customer's next purchase.
--
-- Cascaded delete on cart_items (FK ON DELETE CASCADE) means
-- deleting the cart row is sufficient to remove all items.
-- =============================================================
DROP TRIGGER IF EXISTS trg_clear_cart_on_order $$
CREATE TRIGGER trg_clear_cart_on_order
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    DELETE FROM carts
    WHERE customer_id = NEW.customer_id;
END $$

-- =============================================================
-- TRIGGER 5: trg_restore_stock_on_cancel
--
-- Fires AFTER UPDATE on orders.
-- When an order transitions to CANCELLED, restores the stock
-- for every line item in that order and reactivates any
-- SOLD_OUT listing that now has stock again.
-- =============================================================
DROP TRIGGER IF EXISTS trg_restore_stock_on_cancel $$
CREATE TRIGGER trg_restore_stock_on_cancel
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.status = 'CANCELLED' AND OLD.status != 'CANCELLED' THEN
        -- Restore stock quantities
        UPDATE listings l
        JOIN order_items oi ON oi.listing_id = l.listing_id
        SET l.stock_quantity = l.stock_quantity + oi.quantity,
            l.updated_at     = CURRENT_TIMESTAMP
        WHERE oi.order_id = NEW.order_id;

        -- Reactivate any listing that was SOLD_OUT but now has stock
        UPDATE listings l
        JOIN order_items oi ON oi.listing_id = l.listing_id
        SET l.status     = 'ACTIVE',
            l.updated_at = CURRENT_TIMESTAMP
        WHERE oi.order_id    = NEW.order_id
          AND l.status       = 'SOLD_OUT'
          AND l.stock_quantity > 0;
    END IF;
END $$

-- =============================================================
-- TRIGGER 6: trg_set_order_updated_at
--
-- Fires BEFORE UPDATE on orders.
-- MySQL's ON UPDATE CURRENT_TIMESTAMP on the updated_at column
-- handles most cases, but this trigger makes it explicit and
-- ensures it fires even on partial updates via stored procs.
-- =============================================================
DROP TRIGGER IF EXISTS trg_set_order_updated_at $$
CREATE TRIGGER trg_set_order_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END $$

DELIMITER ;
