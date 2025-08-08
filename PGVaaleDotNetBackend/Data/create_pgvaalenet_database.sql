-- PGVaaleNet Database Setup Script
-- Run this script in your MySQL database to create all necessary tables

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS PGvaalenet;
USE PGvaalenet;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    aadhaar VARCHAR(12) NOT NULL,
    age INT,
    gender VARCHAR(10),
    mobile_number VARCHAR(10) NOT NULL,
    unique_id VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create maids table
CREATE TABLE IF NOT EXISTS maids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    aadhaar VARCHAR(12) NOT NULL,
    services TEXT,
    monthly_salary DECIMAL(10,2) DEFAULT 0.00,
    gender VARCHAR(10),
    timing VARCHAR(100),
    region VARCHAR(100),
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    unique_id VARCHAR(255) NOT NULL UNIQUE
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    unique_id VARCHAR(255) NOT NULL UNIQUE
);

-- Create owners table
CREATE TABLE IF NOT EXISTS owners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    age INT,
    aadhaar VARCHAR(12) NOT NULL,
    mobile_number VARCHAR(10) NOT NULL,
    region VARCHAR(100)
);

-- Create pgs table
CREATE TABLE IF NOT EXISTS pgs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT,
    user_id INT,
    image_paths TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    amenities TEXT,
    nearby_resources TEXT,
    rent DECIMAL(10,2),
    general_preference VARCHAR(100),
    region VARCHAR(100),
    availability VARCHAR(50) DEFAULT 'Available',
    FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_maid table
CREATE TABLE IF NOT EXISTS user_maid (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    maid_id INT,
    status VARCHAR(50),
    assigned_date_time TIMESTAMP,
    accepted_date_time TIMESTAMP,
    deletion_date_time TIMESTAMP,
    user_address TEXT,
    start_date DATE,
    end_date DATE,
    time_slot VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (maid_id) REFERENCES maids(id) ON DELETE CASCADE
);

-- Create tiffins table
CREATE TABLE IF NOT EXISTS tiffins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    aadhaar VARCHAR(12) NOT NULL,
    services TEXT,
    monthly_salary DECIMAL(10,2) DEFAULT 0.00,
    gender VARCHAR(10),
    timing VARCHAR(100),
    region VARCHAR(100),
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    unique_id VARCHAR(255) NOT NULL UNIQUE
);

-- Create user_tiffins table
CREATE TABLE IF NOT EXISTS user_tiffins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    tiffin_id INT,
    status VARCHAR(50),
    assigned_date_time TIMESTAMP,
    accepted_date_time TIMESTAMP,
    deletion_date_time TIMESTAMP,
    user_address TEXT,
    start_date DATE,
    end_date DATE,
    time_slot VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tiffin_id) REFERENCES tiffins(id) ON DELETE CASCADE
);

-- Create menus table
CREATE TABLE IF NOT EXISTS menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tiffin_id INT,
    day_of_week VARCHAR(20),
    breakfast TEXT,
    lunch TEXT,
    dinner TEXT,
    price DECIMAL(10,2),
    FOREIGN KEY (tiffin_id) REFERENCES tiffins(id) ON DELETE CASCADE
);

-- Create feedback_tiffins table
CREATE TABLE IF NOT EXISTS feedback_tiffins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tiffin_id INT,
    user_id INT,
    feedback TEXT,
    rating INT,
    FOREIGN KEY (tiffin_id) REFERENCES tiffins(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    maid_id INT,
    user_id INT,
    feedback TEXT,
    rating INT,
    FOREIGN KEY (maid_id) REFERENCES maids(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create feedback_web table
CREATE TABLE IF NOT EXISTS feedback_web (
    id INT AUTO_INCREMENT PRIMARY KEY,
    feedback TEXT,
    rating INT
);

-- Create contact_us table
CREATE TABLE IF NOT EXISTS contact_us (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    message TEXT
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    service_type VARCHAR(50),
    service_provider_id INT,
    booking_date DATE,
    status VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

-- Create service_providers table
CREATE TABLE IF NOT EXISTS service_providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(100),
    region VARCHAR(100),
    approved BOOLEAN DEFAULT FALSE
);

-- Create pg_details table
CREATE TABLE IF NOT EXISTS pg_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pg_id INT,
    description TEXT,
    rules TEXT,
    facilities TEXT,
    FOREIGN KEY (pg_id) REFERENCES pgs(id) ON DELETE CASCADE
);

-- Insert default admin
INSERT INTO admins (username, password, email, name, unique_id) 
VALUES ('admin', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@pgvaale.com', 'System Admin', 'ADMIN_001')
ON DUPLICATE KEY UPDATE username=username;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_maids_username ON maids(username);
CREATE INDEX IF NOT EXISTS idx_maids_email ON maids(email);
CREATE INDEX IF NOT EXISTS idx_maids_approved ON maids(approved);
CREATE INDEX IF NOT EXISTS idx_maids_region ON maids(region);
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_unique_id ON admins(unique_id);
CREATE INDEX IF NOT EXISTS idx_pgs_owner_id ON pgs(owner_id);
CREATE INDEX IF NOT EXISTS idx_pgs_user_id ON pgs(user_id);
CREATE INDEX IF NOT EXISTS idx_pgs_region ON pgs(region);
CREATE INDEX IF NOT EXISTS idx_pgs_availability ON pgs(availability);

-- Show tables
SHOW TABLES;
