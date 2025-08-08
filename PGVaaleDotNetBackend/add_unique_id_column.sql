-- SQL script to add missing unique_id column to existing tables
-- Run this script in your MySQL database (PGVaale) to fix the schema mismatch

USE pgvaale;

-- Add unique_id column to admin table (if it exists)
ALTER TABLE admin ADD COLUMN unique_id VARCHAR(255) DEFAULT '';

-- Add unique_id column to user table (if it exists)  
ALTER TABLE user ADD COLUMN unique_id VARCHAR(255) DEFAULT '';

-- Add unique_id column to maid table (if it exists)
ALTER TABLE maid ADD COLUMN unique_id VARCHAR(255) DEFAULT '';

-- Add unique_id column to tiffin table (if it exists)
ALTER TABLE tiffin ADD COLUMN unique_id VARCHAR(255) DEFAULT '';

-- You can run this script in MySQL Workbench, phpMyAdmin, or any MySQL client
-- Or run it from command line with: mysql -u root -pcdac < add_unique_id_column.sql
