-- Create feedback_tiffins table
CREATE TABLE IF NOT EXISTS feedback_tiffins (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tiffin_id BIGINT NOT NULL,
    rating INT NOT NULL,
    feedback VARCHAR(255) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tiffin_id) REFERENCES tiffins(id) ON DELETE CASCADE
);
