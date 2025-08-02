-- Create maid_requests table
CREATE TABLE IF NOT EXISTS maid_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    maid_id BIGINT,
    user_id BIGINT,
    request_date DATE,
    service_date DATE,
    time_slot VARCHAR(50),
    status ENUM('REQUESTED', 'ACCEPTED', 'REJECTED', 'COMPLETED') DEFAULT 'REQUESTED',
    FOREIGN KEY (maid_id) REFERENCES maids(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Update feedback table to include maid_id and user_id
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS maid_id BIGINT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS user_id BIGINT;
ALTER TABLE feedback ADD FOREIGN KEY IF NOT EXISTS (maid_id) REFERENCES maids(id);
ALTER TABLE feedback ADD FOREIGN KEY IF NOT EXISTS (user_id) REFERENCES users(id); 