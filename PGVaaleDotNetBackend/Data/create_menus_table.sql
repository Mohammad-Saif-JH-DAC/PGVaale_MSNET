-- Create menus table
CREATE TABLE IF NOT EXISTS menus (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tiffin_id BIGINT NOT NULL,
    day_of_week VARCHAR(255) NOT NULL,
    breakfast VARCHAR(255) NOT NULL,
    lunch VARCHAR(255) NOT NULL,
    dinner VARCHAR(255) NOT NULL,
    menu_date DATETIME(6) NOT NULL,
    food_category VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL,
    is_active BIT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (tiffin_id) REFERENCES tiffins(id) ON DELETE CASCADE
);
