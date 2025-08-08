-- Create tiffins table
CREATE TABLE IF NOT EXISTS tiffins (
    id BIGINT NOT NULL PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(255),
    password VARCHAR(255),
    username VARCHAR(255),
    aadhaar VARCHAR(255),
    approved BIT(1) NOT NULL DEFAULT 0,
    food_category VARCHAR(255),
    maid_address VARCHAR(255),
    phone_number VARCHAR(255),
    price DOUBLE NOT NULL,
    region VARCHAR(255),
    unique_id VARCHAR(255)
);

-- Create tiffin_sequence table for ID generation
CREATE TABLE IF NOT EXISTS tiffin_sequence (
    next_val BIGINT
);

-- Insert initial sequence value
INSERT INTO tiffin_sequence (next_val) VALUES (3000);
