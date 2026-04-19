-- Fix password hash - Run this in MySQL
-- The new hash is for "password123"
USE hypeculture_db;
UPDATE users SET password_hash = '$2a$12$UG0ehJiQWNQe77y4Ttm/nefQFTFKz229U7bFrgF9YQIgTFUOjTkP.' WHERE email IN ('admin@hypeculture.com', 'super@hypeculture.com', 'kicks@vault.com', 'sole@matrix.com', 'hype@garage.com', 'drop@trade.com', 'jordan@example.com', 'sneaker42@example.com', 'kickcol@example.com', 'fresh@example.com', 'hypebot@example.com');