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

-- Create index for better performance
CREATE INDEX idx_maids_username ON maids(username);
CREATE INDEX idx_maids_email ON maids(email);
CREATE INDEX idx_maids_approved ON maids(approved);
CREATE INDEX idx_maids_region ON maids(region);
