-- PGVaale Database Setup Script
-- Run this script in your MySQL database to create all necessary tables

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS pgvaale;
USE pgvaale;

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_maids_username ON maids(username);
CREATE INDEX IF NOT EXISTS idx_maids_email ON maids(email);
CREATE INDEX IF NOT EXISTS idx_maids_approved ON maids(approved);
CREATE INDEX IF NOT EXISTS idx_maids_region ON maids(region);

-- Insert sample data (optional)
-- INSERT INTO users (username, password, email, name, aadhaar, age, gender, mobile_number, unique_id) 
-- VALUES ('testuser', '$2a$11$example_hash', 'test@example.com', 'Test User', '123456789012', 25, 'Male', '1234567890', 'USER_123456789');

-- Show tables
SHOW TABLES;

-- Show table structures
DESCRIBE users;
DESCRIBE maids;
