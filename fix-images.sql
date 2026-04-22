-- Fix product image URLs to match actual files in /public/images/products/
USE hypeculture_db;

UPDATE products SET image_url = '/images/products/5-air-force-1.jpg'    WHERE shoe_name = 'Air Force 1 Low';
UPDATE products SET image_url = '/images/products/2-yeezy-350.jpg'       WHERE shoe_name = 'Adidas Superstar';
UPDATE products SET image_url = '/images/products/4-nb-550.jpg'          WHERE shoe_name = 'New Balance 550';
UPDATE products SET image_url = '/images/products/12-asics-gel-kayano.jpg' WHERE shoe_name = 'Asics Gel-1130';
UPDATE products SET image_url = '/images/products/10-air-max-90.jpg'     WHERE shoe_name = 'Nike Pegasus 41';
UPDATE products SET image_url = '/images/products/8-ultra-boost.jpg'     WHERE shoe_name = 'Adidas Ultraboost 24';
UPDATE products SET image_url = '/images/products/12-asics-gel-kayano.jpg' WHERE shoe_name = 'ASICS Gel-Kayano 31';
UPDATE products SET image_url = '/images/products/1-air-jordan-1.jpg'    WHERE shoe_name = 'Jordan 1 Retro High OG';
UPDATE products SET image_url = '/images/products/3-dunk-low-panda.jpg'  WHERE shoe_name = 'Nike LeBron 21';
UPDATE products SET image_url = '/images/products/3-dunk-low-panda.jpg'  WHERE shoe_name = 'Adidas Harden Vol 8';
UPDATE products SET image_url = '/images/products/7-timberland-6inch.jpg' WHERE shoe_name = 'Timberland 6-Inch Premium';
UPDATE products SET image_url = '/images/products/11-dr-martens-1460.jpg' WHERE shoe_name = 'Dr Martens 1460';
UPDATE products SET image_url = '/images/products/9-vans-old-skool.jpg'  WHERE shoe_name = 'Vans Old Skool';
UPDATE products SET image_url = '/images/products/6-chuck-taylor.jpg'    WHERE shoe_name = 'Converse Chuck Taylor All Star';
UPDATE products SET image_url = '/images/products/9-vans-old-skool.jpg'  WHERE shoe_name = 'Crocs Classic Clog';
