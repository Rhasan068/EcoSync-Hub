-- ECOSYNC HUB - DATABASE SCHEMA & SEED DATA
-- Version: 2.1 
-- Author: Rakibul Hasan
-- Description: Comprehensive schema supporting Shop, Sustainability Tracking, Social, and Messaging.

-- 1. DATABASE INITIALIZATION
CREATE DATABASE IF NOT EXISTS ecosync_hub;
USE ecosync_hub;

-- Disable constraints temporarily to allow safe table dropping and recreation
SET FOREIGN_KEY_CHECKS = 0;

-- 2. TABLE DEFINITIONS

-- 2.1 Users Table: Core identity and impact tracking
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,    
    first_name VARCHAR(100) NOT NULL DEFAULT '',
    last_name VARCHAR(100) NOT NULL DEFAULT '',
    birth_date DATE,
    gender VARCHAR(20) NOT NULL DEFAULT 'Other',
    role ENUM('user', 'seller', 'admin') DEFAULT 'user',
    bio TEXT,
    avatar_url TEXT,
    eco_points INT NOT NULL DEFAULT 0,
    carbon_saved_kg DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    trees_planted INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2.2 Categories Table: Grouping for products and challenges
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.3 Products Table: Sustainable marketplace inventory
DROP TABLE IF EXISTS products;
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    category_id INT,
    stock INT NOT NULL DEFAULT 0,
    image_url TEXT,
    eco_rating INT NOT NULL DEFAULT 5,
    co2_reduction_kg DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 2.4 Challenges Table: Community sustainability missions
DROP TABLE IF EXISTS challenges;
CREATE TABLE challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points_reward INT NOT NULL DEFAULT 0,
    co2_saving_kg DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    duration_days INT NOT NULL DEFAULT 7,
    image_url TEXT,
    category ENUM('Day', 'Week', 'Month') DEFAULT 'Week',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.5 User Challenges Table: Tracking user participation in missions
DROP TABLE IF EXISTS user_challenges;
CREATE TABLE user_challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    challenge_id INT NOT NULL,
    status ENUM('active', 'completed', 'failed') DEFAULT 'active',
    progress INT DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
);

-- 2.6 Orders Table: Marketplace transaction headers
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT,
    payment_intent_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2.7 Order Items Table: Individual products within an order
DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 2.8 Carbon Logs Table: Historical record of CO2 reductions
DROP TABLE IF EXISTS carbon_logs;
CREATE TABLE carbon_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount_kg DECIMAL(10,2) NOT NULL,
    source VARCHAR(255) NOT NULL,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2.9 Messages Table: Peer-to-peer communication
DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2.10 Cart Items Table: Transient shopping cart storage
DROP TABLE IF EXISTS cart_items;
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 2.11 Reviews Table: Product feedback and ratings
DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating INT DEFAULT 5,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 2.12 Posts Table: Community social feed content
DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2.13 Post Likes Table: Social reactions Tracking
DROP TABLE IF EXISTS post_likes;
CREATE TABLE post_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (user_id, post_id)
);

-- 2.14 Post Comments Table: Social discussion
DROP TABLE IF EXISTS post_comments;
CREATE TABLE post_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- 2.15 Friends Table: User social connections
DROP TABLE IF EXISTS friends;
CREATE TABLE friends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id_1 INT NOT NULL,
    user_id_2 INT NOT NULL,
    status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
    action_user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_friendship (user_id_1, user_id_2)
);

-- 2.16 Notifications Table: Real-time user alerts
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL DEFAULT 'Notification',
    message TEXT NOT NULL DEFAULT '',
    type ENUM('info', 'success', 'warning', 'error', 'challenge', 'order', 'friend') DEFAULT 'info',
    reference_id INT,
    reference_type VARCHAR(50) NOT NULL DEFAULT '',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2.17 User Addresses Table: Customer shipping preferences
DROP TABLE IF EXISTS user_addresses;
CREATE TABLE user_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_type ENUM('home', 'work', 'other') DEFAULT 'home',
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    house_flat_no VARCHAR(100),
    road_street VARCHAR(255),
    area_locality VARCHAR(255),
    post_office VARCHAR(100),
    thana_upazila VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    division VARCHAR(100) NOT NULL DEFAULT '',
    postal_code VARCHAR(10) NOT NULL,
    country VARCHAR(100) DEFAULT 'BANGLADESH',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2.18 Wishlists Table: User-saved products
DROP TABLE IF EXISTS wishlists;
CREATE TABLE wishlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 2.19 Districts Table: Geographical metadata
DROP TABLE IF EXISTS districts;
CREATE TABLE districts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.20 Email Verifications Table: Security tokens
DROP TABLE IF EXISTS email_verifications;
CREATE TABLE email_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2.21 Password Resets Table: Account recovery tokens
DROP TABLE IF EXISTS password_resets;
CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2.22 User Sessions Table: Persistent session storage
DROP TABLE IF EXISTS user_sessions;
CREATE TABLE user_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    data TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. INDEXING & PERFORMANCE
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_challenges_title ON challenges(title);

-- 4. VIEWS
CREATE OR REPLACE VIEW active_challenges_view AS 
SELECT uc.*, c.title, c.description, c.points_reward, c.co2_saving_kg 
FROM user_challenges uc 
JOIN challenges c ON uc.challenge_id = c.id 
WHERE uc.status = 'active';

CREATE OR REPLACE VIEW product_performance_view AS 
SELECT p.id, p.name, p.price, COUNT(oi.id) as total_orders, SUM(oi.quantity) as total_units_sold, SUM(oi.price * oi.quantity) as total_revenue
FROM products p 
LEFT JOIN order_items oi ON p.id = oi.product_id 
GROUP BY p.id;

CREATE OR REPLACE VIEW user_stats_view AS 
SELECT u.id, u.username, u.eco_points, u.carbon_saved_kg, u.trees_planted,
(SELECT COUNT(*) FROM user_challenges WHERE user_id = u.id AND status = 'completed') as challenges_completed,
(SELECT COUNT(*) FROM orders WHERE user_id = u.id) as total_orders
FROM users u;

-- 5. TRIGGERS
DELIMITER //
CREATE TRIGGER after_order_delivered
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    DECLARE total_co2 DECIMAL(10,2);
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        SELECT SUM(p.co2_reduction_kg * oi.quantity) INTO total_co2
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = NEW.id;
        IF total_co2 IS NOT NULL AND total_co2 > 0 THEN
            UPDATE users SET eco_points = eco_points + (total_co2 * 10), carbon_saved_kg = carbon_saved_kg + total_co2 WHERE id = NEW.user_id;
            INSERT INTO carbon_logs (user_id, amount_kg, source) VALUES (NEW.user_id, total_co2, CONCAT('Order #', NEW.id, ' Delivered'));
        END IF;
    END IF;
END //

CREATE TRIGGER after_challenge_completed
AFTER UPDATE ON user_challenges
FOR EACH ROW
BEGIN
    DECLARE pts INT;
    DECLARE co2 DECIMAL(10,2);
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        SELECT points_reward, co2_saving_kg INTO pts, co2 FROM challenges WHERE id = NEW.challenge_id;
        UPDATE users SET eco_points = eco_points + pts, carbon_saved_kg = carbon_saved_kg + co2 WHERE id = NEW.user_id;
        INSERT INTO carbon_logs (user_id, amount_kg, source) VALUES (NEW.user_id, co2, 'Challenge Completed');
    END IF;
END //
DELIMITER ;

-- Re-enable constraints
SET FOREIGN_KEY_CHECKS = 1;

-- 6. SYSTEM SEED DATA
-- Recommended: Use valid Gmail addresses for verification
-- IMPORTANT: Store BCrypt hashed passwords only. 
-- To generate a new hash, use a tool like 'bcrypt-simulator.com' 
-- or 'node -e "console.log(require(\'bcryptjs\').hashSync(\'yourpassword\', 10))"'
-- admin pw: rhasan68
-- seller pw: seller123
-- user pw: user123

-- 6.1 Users
INSERT INTO users (id, username, email, password, first_name, last_name, role, eco_points, carbon_saved_kg, trees_planted, avatar_url) VALUES
(1, 'AdminUser', 'rhasan211068@bscse.uiu.ac.bd', '$2a$10$cpV0CNlKj0MqQUfs3v1qmurGA9f0p5H334fboi.bdNwAv1iMpE4km', 'Rakibul', 'Hasan', 'admin', 1250, 45.50, 12, 'https://lh3.googleusercontent.com/a/ACg8ocIhE7Fe11x5kGbdnd2MjLIcch6Q-Oxn3sCjZ0eMoYQIKH0Cn5E=s288-c-no'),
(2, 'demoseller', 'seller@example.com', '$2a$10$G2lukLkZhQSrf6oqBzn8QeSYR8bs.ZIs.hmUTnBBrWLPRbBMKiyJC', 'Eco', 'Merchant', 'seller', 150, 10.00, 2, 'https://scontent.fdac207-1.fna.fbcdn.net/v/t39.30808-1/515044303_2464236017270275_586374745892507452_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=1d2534&_nc_ohc=IPZX1OUkQkMQ7kNvwF9zHIE&_nc_oc=Admi_hNPbiaIusRBDifkPEeRYNbfa81-3ovEtgGB-pOEFLN4bxAE8dkHV6WXrC9ySUQ&_nc_zt=24&_nc_ht=scontent.fdac207-1.fna&_nc_gid=Ay0MoPoeUFwnk8radfVEjA&oh=00_Afo-IdLTUsdmWcfDMHUeXPfD5AjJFEHTsIzIGBrTfy4JAQ&oe=6973D303S'),
(3, 'NormalUser', 'user@example.com', '$2a$10$U/v7Kb/jWl4UALrh6fvkGwaa6GNm', 'Standard', 'Warrior', 'user', 50, 2.50, 1, 'https://lh3.googleusercontent.com/a/ACg8ocI8uQltkWD4eIAIHSNf5G-mY7TDWWg47vuzTgDcdNd-UzOUftqp=s288-c-no');

-- 6.2 Categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Home & Living', 'Sustainable products for your eco-friendly home'),
(2, 'Personal Care', 'Organic and plastic-free grooming essentials'),
(3, 'Gadgets', 'Solar and manual powered green technology');

-- 6.3 Products
INSERT INTO products (id, name, description, price, category_id, stock, image_url, eco_rating, co2_reduction_kg, status) VALUES
(1, 'Bamboo Toothbrush', 'Pack of 4 biodegradable brushes with soft bristles', 550.00, 2, 50, '/uploads/bamboo_toothbrush.png', 5, 0.50, 'approved'),
(2, 'Solar Power Bank', '20000mAh weather-proof portable green energy charger', 3500.00, 3, 20, '/uploads/solar_power_bank.png', 5, 12.00, 'approved'),
(3, 'Organic Soap Bar', 'Handmade lavender soap with moisturizing organic oils', 250.00, 2, 100, 'https://images.unsplash.com/photo-1546552356-3fae876a61ca', 4, 0.20, 'approved');

-- 6.4 Challenges
INSERT INTO challenges (id, title, description, points_reward, co2_saving_kg, duration_days, category, image_url) VALUES
(1, 'Plastic Free Week', 'Use zero single-use plastics for 7 consecutive days', 100, 5.00, 7, 'Week', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b'),
(2, 'Tree Planter', 'Plant 3 native trees in your local neighborhood', 500, 25.00, 30, 'Month', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09');

-- 6.5 User Challenges
INSERT INTO user_challenges (user_id, challenge_id, status, progress) VALUES
(1, 1, 'completed', 100),
(1, 2, 'active', 60),
(2, 1, 'active', 20);

-- 6.6 Orders & Items
INSERT INTO orders (id, user_id, total_amount, status, shipping_address) VALUES
(1, 3, 4050.00, 'delivered', 'Dhanmondi 15, Dhaka, Bangladesh'),
(2, 3, 550.00, 'paid', 'Banani Road 11, Dhaka');

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 550.00),
(1, 2, 1, 3500.00),
(2, 1, 1, 550.00);

-- 6.7 Carbon Logs
INSERT INTO carbon_logs (user_id, amount_kg, source) VALUES
(1, 12.5, 'Project Milestone'),
(3, 12.5, 'Order #1 Purchase');

-- 6.8 Social (Messages)
INSERT INTO messages (sender_id, receiver_id, content) VALUES
(1, 2, 'Welcome to EcoSync Hub!'),
(2, 1, 'Thanks! Happy to be here.');

-- 6.9 Social (Posts)
INSERT INTO posts (id, user_id, content, image_url) VALUES
(1, 1, 'Just planted my first tree! #EcoWarrior', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09');

INSERT INTO post_likes (user_id, post_id) VALUES (2, 1), (3, 1);
INSERT INTO post_comments (user_id, post_id, content) VALUES (2, 1, 'Great job, Rakibul!');

-- 6.10 Friends
INSERT INTO friends (user_id_1, user_id_2, status, action_user_id) VALUES (1, 2, 'accepted', 1), (1, 3, 'pending', 3);

-- 6.11 Wishlist
INSERT INTO wishlists (user_id, product_id) VALUES (3, 2);

-- 6.12 Districts
INSERT INTO districts (name, code) VALUES ('Dhaka', 'DHK'), ('Chittagong', 'CTG'), ('Sylhet', 'SYL');

-- 6.13 Addresses
INSERT INTO user_addresses (user_id, full_name, phone, house_flat_no, road_street, area_locality, thana_upazila, district, postal_code) VALUES
(1, 'Rakibul Hasan', '+8801700000000', 'Flat 4B, Skyview', 'Road 5', 'Dhanmondi', 'Dhanmondi', 'Dhaka', '1209');

-- 7. END OF SCRIPT
