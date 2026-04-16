-- =============================================================
-- HypeCulture — Seed Data
-- MySQL 8.0+
-- Run AFTER schema.sql
-- Passwords are bcrypt hashes of "password123"
-- =============================================================

USE hypeculture_db;

-- =============================================================
-- CATEGORIES
-- =============================================================
INSERT INTO categories (category_name, description) VALUES
    ('Sneakers',  'Classic and lifestyle sneakers for everyday wear'),
    ('Running',   'Performance running shoes built for speed and comfort'),
    ('Basketball','High-top and low-top basketball court shoes'),
    ('Boots',     'Casual and fashion boots including chunky and work styles'),
    ('Casual',    'Relaxed everyday shoes and slip-ons');

-- =============================================================
-- USERS
-- All passwords are bcrypt hash of "password123"
-- =============================================================

-- Admins
INSERT INTO users (username, email, password_hash, role, admin_level) VALUES
    ('admin',       'admin@hypeculture.com',   '$2a$12$UG0ehJiQWNQe77y4Ttm/nefQFTFKz229U7bFrgF9YQIgTFUOjTkP.', 'ADMIN', 1),
    ('superadmin',  'super@hypeculture.com',   '$2a$12$UG0ehJiQWNQe77y4Ttm/nefQFTFKz229U7bFrgF9YQIgTFUOjTkP.', 'ADMIN', 2);

-- Sellers
INSERT INTO users (username, email, password_hash, role, seller_rating, total_sales, is_verified) VALUES
    ('kicksvault',    'kicks@vault.com',        '$2a$12$UG0ehJiQWNQe77y4Ttm/nefQFTFKz229U7bFrgF9YQIgTFUOjTkP.', 'SELLER', 4.80, 312, 1),
    ('solematrix',    'sole@matrix.com',        '$2a$12$UG0ehJiQWNQe77y4Ttm/nefQFTFKz229U7bFrgF9YQIgTFUOjTkP.', 'SELLER', 4.60, 198, 1),
    ('hypegarage',    'hype@garage.com',        '$2a$12$UG0ehJiQWNQe77y4Ttm/nefQFTFKz229U7bFrgF9YQIgTFUOjTkP.', 'SELLER', 4.20, 87,  0),
    ('droptrade',     'drop@trade.com',         '$2a$12$UG0ehJiQWNQe77y4Ttm/nefQFTFKz229U7bFrgF9YQIgTFUOjTkP.', 'SELLER', 3.90, 54,  0);

-- Customers
INSERT INTO users (username, email, password_hash, role, shipping_address, city, state, zip_code) VALUES
    ('jordanfan99',   'jordan@example.com',    '$2a$12$UG0ehJiQWNQe77y4Ttm/nefQFTFKz229U7bFrgF9YQIgTFUOjTkP.', 'CUSTOMER', '12 Oak Street',      'Chicago',      'IL', '60601'),
    ('sneakerhead42', 'sneaker42@example.com', '$2a$12$UG0ehJiQWNQe77y4Ttm/nefQFTFKz229U7bFrgF9YQIgTFUOjTkP.', 'CUSTOMER', '88 Maple Ave',       'New York',     'NY', '10001'),
    ('kickcollector', 'kickcol@example.com',   '$2a$12$UG0ehJiQWNQe77y4Ttm/nefQFTFKz229U7bFrgF9YQIgTFUOjTkP.', 'CUSTOMER', '5 Sunset Blvd',      'Los Angeles',  'CA', '90028'),
    ('freshstepz',    'fresh@example.com',     '$2a$12$UG0ehJiQWNQe77y4Ttm/nefQFTFKz229U7bFrgF9YQIgTFUOjTkP.', 'CUSTOMER', '33 Peachtree Road',  'Atlanta',      'GA', '30301'),
    ('hypebot2000',   'hypebot@example.com',   '$2a$12$UG0ehJiQWNQe77y4Ttm/nefQFTFKz229U7bFrgF9YQIgTFUOjTkP.', 'CUSTOMER', '7 Congress Ave',     'Austin',       'TX', '78701');

-- =============================================================
-- PRODUCTS  (master catalog)
-- category_id: 1=Sneakers, 2=Running, 3=Basketball, 4=Boots, 5=Casual
-- =============================================================
INSERT INTO products (shoe_name, brand, model, category_id, description, image_url) VALUES
    -- Sneakers
    ('Air Force 1 Low',         'Nike',    'Air Force 1 Low 07',       1, 'The iconic all-white low-top that started it all. Premium leather upper with Air cushioning.',           '/images/products/af1-low.jpg'),
    ('Adidas Superstar',        'Adidas',  'Superstar 80s',             1, 'Shell-toe legend. Original rubber shell toe and smooth leather upper.',                                  '/images/products/superstar.jpg'),
    ('New Balance 550',         'New Balance', '550 Court',             1, 'Basketball-inspired silhouette revived as a lifestyle sneaker. Clean, minimal lines.',                   '/images/products/nb550.jpg'),
    ('Asics Gel-1130',          'Asics',   'Gel-1130',                  1, 'Y2K running tech reborn as a streetwear staple. Chunky sole with premium mesh upper.',                  '/images/products/gel1130.jpg'),

    -- Running
    ('Nike Pegasus 41',         'Nike',    'Air Zoom Pegasus 41',       2, 'Everyday trainer built for distance. React foam midsole with Zoom Air units.',                          '/images/products/peg41.jpg'),
    ('Adidas Ultraboost 24',    'Adidas',  'Ultraboost 24',             2, 'Primeknit upper with full-length Boost midsole. Energy return for long runs.',                          '/images/products/ub24.jpg'),
    ('ASICS Gel-Kayano 31',     'Asics',   'Gel-Kayano 31',             2, 'Premium stability running shoe. FF Blast+ midsole with Gel technology in heel.',                        '/images/products/kayano31.jpg'),

    -- Basketball
    ('Jordan 1 Retro High OG',  'Jordan',  'Air Jordan 1 Retro High OG', 3, 'The shoe that changed everything. Full-grain leather upper, Air cushioning, original colorways.',    '/images/products/aj1-high.jpg'),
    ('Nike LeBron 21',          'Nike',    'LeBron 21',                 3, 'Built for the biggest player in the game. Full-length Air Max unit for maximum impact protection.',     '/images/products/lebron21.jpg'),
    ('Adidas Harden Vol 8',     'Adidas',  'Harden Vol. 8',             3, 'Low-cut court shoe designed around Harden moves. Responsive Boost midsole.',                           '/images/products/harden8.jpg'),

    -- Boots
    ('Timberland 6-Inch Premium', 'Timberland', '6-Inch Premium WP',   4, 'Original waterproof boot. Seam-sealed construction with anti-fatigue footbed.',                         '/images/products/timb6in.jpg'),
    ('Dr Martens 1460',         'Dr. Martens', '1460 Smooth',           4, 'Eight-eyelet classic with smooth leather and iconic yellow welt stitching.',                            '/images/products/dm1460.jpg'),

    -- Casual
    ('Vans Old Skool',          'Vans',    'Old Skool Classic',         5, 'The OG skate shoe. Suede and canvas upper with waffle outsole and side stripe.',                        '/images/products/vans-os.jpg'),
    ('Converse Chuck Taylor All Star', 'Converse', 'Chuck Taylor All Star Hi', 5, 'Canvas high-top that has outlasted every trend. OrthoLite insole for all-day comfort.', '/images/products/chuck-hi.jpg'),
    ('Crocs Classic Clog',      'Crocs',   'Classic Clog',              5, 'Lightweight, buoyant Croslite foam construction. Love them or leave them.',                            '/images/products/crocs.jpg');

-- =============================================================
-- LISTINGS
-- seller_id: 3=kicksvault, 4=solematrix, 5=hypegarage, 6=droptrade
-- =============================================================
INSERT INTO listings (product_id, seller_id, size, condition_type, price, stock_quantity, status, description) VALUES
    -- Air Force 1 Low (product 1)
    (1, 3, 10.0, 'NEW',  120.00, 5,  'ACTIVE', 'DS pair. OG all. Ships in original box.'),
    (1, 4, 9.5,  'NEW',  115.00, 3,  'ACTIVE', 'Deadstock. Stored in climate-controlled space.'),
    (1, 5, 11.0, 'USED', 85.00,  2,  'ACTIVE', 'Worn twice. 9/10 condition. Minor scuff on left heel.'),

    -- Adidas Superstar (product 2)
    (2, 3, 9.0,  'NEW',  95.00,  4,  'ACTIVE', 'Comes with extra laces. Box has slight damage.'),
    (2, 6, 10.0, 'NEW',  100.00, 2,  'ACTIVE', 'Flawless pair. Ships same day.'),

    -- New Balance 550 (product 3)
    (3, 4, 10.0, 'NEW',  130.00, 6,  'ACTIVE', 'White/burgundy colorway. Ships in 2-3 days.'),
    (3, 5, 9.0,  'NEW',  125.00, 3,  'ACTIVE', 'Cream/navy. Lightly shelf-worn display pair.'),

    -- Asics Gel-1130 (product 4)
    (4, 3, 10.5, 'NEW',  110.00, 4,  'ACTIVE', 'White/silver. Fresh pair, never worn.'),
    (4, 6, 9.5,  'USED', 75.00,  1,  'ACTIVE', 'Worn a handful of times. Great shape.'),

    -- Nike Pegasus 41 (product 5)
    (5, 4, 11.0, 'NEW',  140.00, 8,  'ACTIVE', 'Running-ready. Still has tissue in the toe box.'),
    (5, 3, 10.0, 'NEW',  135.00, 5,  'ACTIVE', 'Latest colourway. Ships next business day.'),

    -- Adidas Ultraboost 24 (product 6)
    (6, 4, 10.0, 'NEW',  190.00, 3,  'ACTIVE', 'Triple black. Full boost return. Ships in original box.'),
    (6, 5, 9.5,  'NEW',  180.00, 2,  'ACTIVE', 'Core black. Unworn. Box crease on lid.'),

    -- Jordan 1 Retro High OG (product 8)
    (8, 3, 10.0, 'NEW',  280.00, 2,  'ACTIVE', 'Chicago colorway. 100% authentic. DS with receipt.'),
    (8, 4, 9.5,  'NEW',  265.00, 1,  'ACTIVE', 'Bred colorway. Authenticated by StockX.'),
    (8, 6, 11.0, 'USED', 190.00, 1,  'ACTIVE', 'Royal Blue. 8.5/10. Creasing on toe box.'),

    -- Timberland 6-Inch (product 11)
    (11, 5, 10.0, 'NEW', 200.00, 4,  'ACTIVE', 'Classic wheat. Waterproof and ready. Ships fast.'),
    (11, 6, 11.0, 'NEW', 195.00, 3,  'ACTIVE', 'Black nubuck. Clean pair. Original box.'),

    -- Dr Martens 1460 (product 12)
    (12, 3, 9.0,  'NEW', 160.00, 5,  'ACTIVE', 'Cherry red smooth leather. Ships in 1-2 days.'),
    (12, 5, 10.0, 'USED', 110.00, 1, 'ACTIVE', 'Black smooth. Worn 5 times. Soles like new.'),

    -- Vans Old Skool (product 13)
    (13, 6, 10.0, 'NEW',  70.00, 10, 'ACTIVE', 'Black/white. Classic colourway. Ships same day.'),
    (13, 4, 9.5,  'NEW',  68.00, 7,  'ACTIVE', 'Navy/white. Clean pair. Great everyday wear.'),

    -- Converse Chuck Taylor (product 14)
    (14, 5, 10.0, 'NEW',  65.00, 8,  'ACTIVE', 'Black hi-top. Canvas upper. Ships in 2 days.'),
    (14, 6, 9.0,  'NEW',  60.00, 6,  'ACTIVE', 'Optical white. Spotless. Original box included.');

-- =============================================================
-- CARTS  (one per customer who has been active)
-- customer_id: 7=jordanfan99, 8=sneakerhead42, 9=kickcollector
-- =============================================================
INSERT INTO carts (customer_id) VALUES (7), (8), (9);

-- =============================================================
-- CART ITEMS  (sample in-progress sessions)
-- cart_id: 1=jordanfan99, 2=sneakerhead42, 3=kickcollector
-- listing references from above
-- =============================================================
INSERT INTO cart_items (cart_id, listing_id, quantity) VALUES
    (1, 14, 1),   -- jordanfan99 has AJ1 Chicago in cart
    (1, 10, 1),   -- + Nike Pegasus 41
    (2, 1,  1),   -- sneakerhead42 has AF1 Low
    (3, 19, 1);   -- kickcollector has Dr Martens Cherry Red

-- =============================================================
-- SAMPLE COMPLETED ORDERS  (for order history + reports)
-- =============================================================
INSERT INTO orders (customer_id, shipping_address, shipping_city, shipping_state, shipping_zip, payment_method, total_amount, status, created_at) VALUES
    (7,  '12 Oak Street',     'Chicago',     'IL', '60601', 'CREDIT_CARD',      280.00, 'DELIVERED', '2026-03-10 14:22:00'),
    (8,  '88 Maple Ave',      'New York',    'NY', '10001', 'UPI',              190.00, 'DELIVERED', '2026-03-15 09:45:00'),
    (9,  '5 Sunset Blvd',     'Los Angeles', 'CA', '90028', 'CREDIT_CARD',      310.00, 'SHIPPED',   '2026-04-01 11:10:00'),
    (10, '33 Peachtree Road', 'Atlanta',     'GA', '30301', 'CASH_ON_DELIVERY', 160.00, 'PLACED',    '2026-04-12 18:00:00');

INSERT INTO order_items (order_id, listing_id, quantity, price_at_purchase) VALUES
    (1, 14, 1, 280.00),   -- jordanfan99 bought AJ1 Chicago
    (2, 16, 1, 190.00),   -- sneakerhead42 bought AJ1 Royal Blue
    (3, 12, 1, 190.00),   -- kickcollector bought Ultraboost 24
    (3, 11, 1, 135.00),   -- + Nike Pegasus 41 (2-item order, total 310 - note: seed price adjusted)
    (4, 19, 1, 160.00);   -- freshstepz bought Dr Martens Cherry Red
