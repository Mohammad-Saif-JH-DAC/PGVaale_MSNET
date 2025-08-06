-- Drop maid_requests table if it exists (migration to new user_maid system)
DROP TABLE IF EXISTS maid_requests;

-- Create user_maid table for the new maid hiring system
CREATE TABLE IF NOT EXISTS user_maid (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    maid_id BIGINT NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED') DEFAULT 'PENDING',
    assigned_date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    accepted_date_time DATETIME NULL,
    deletion_date_time DATETIME NULL,
    user_address TEXT,
    start_date DATE,
    end_date DATE,
    time_slot VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (maid_id) REFERENCES maids(id)
);



-- Update feedback table to include maid_id and user_id
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS maid_id BIGINT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS user_id BIGINT;
ALTER TABLE feedback ADD FOREIGN KEY IF NOT EXISTS (maid_id) REFERENCES maids(id);
ALTER TABLE feedback ADD FOREIGN KEY IF NOT EXISTS (user_id) REFERENCES users(id); 

-- Add new tables for tiffin functionality

-- Menu table
CREATE TABLE IF NOT EXISTS menus (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tiffin_id BIGINT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    breakfast TEXT NOT NULL,
    lunch TEXT NOT NULL,
    dinner TEXT NOT NULL,
    menu_date DATE,
    food_category VARCHAR(20) DEFAULT 'Veg',
    price DOUBLE DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tiffin_id) REFERENCES tiffins(id) ON DELETE CASCADE
);

-- User Tiffin table
CREATE TABLE IF NOT EXISTS user_tiffins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tiffin_id BIGINT NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    assigned_date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deletion_date_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tiffin_id) REFERENCES tiffins(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_tiffin (user_id, tiffin_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menus_tiffin_id ON menus(tiffin_id);
CREATE INDEX IF NOT EXISTS idx_menus_day_of_week ON menus(day_of_week);
CREATE INDEX IF NOT EXISTS idx_menus_is_active ON menus(is_active);
CREATE INDEX IF NOT EXISTS idx_user_tiffins_user_id ON user_tiffins(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tiffins_tiffin_id ON user_tiffins(tiffin_id);
CREATE INDEX IF NOT EXISTS idx_user_tiffins_status ON user_tiffins(status);
CREATE INDEX IF NOT EXISTS idx_user_tiffins_assigned_date_time ON user_tiffins(assigned_date_time); 