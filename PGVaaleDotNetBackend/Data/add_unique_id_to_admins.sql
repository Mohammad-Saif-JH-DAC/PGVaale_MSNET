-- Add unique_id column to admins table
-- Run this script to add the missing unique_id column

USE pgvaale;

-- Add unique_id column to admins table
ALTER TABLE admins ADD COLUMN unique_id VARCHAR(255) NOT NULL UNIQUE;

-- Add index for better performance
CREATE INDEX idx_admins_username ON admins(username);
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_unique_id ON admins(unique_id);
