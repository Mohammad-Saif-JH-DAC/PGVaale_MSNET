-- Create user_tiffins table
CREATE TABLE IF NOT EXISTS user_tiffins (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tiffin_id BIGINT NOT NULL,
    assigned_date_time DATETIME(6) NOT NULL,
    deletion_date_time DATETIME(6),
    status ENUM('ACCEPTED', 'PENDING', 'REJECTED') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tiffin_id) REFERENCES tiffins(id) ON DELETE CASCADE
);
