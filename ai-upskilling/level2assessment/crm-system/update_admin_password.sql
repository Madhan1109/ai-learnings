-- Update admin user password to "admin123" with proper BCrypt hash
-- This hash was generated using BCrypt with strength 12
UPDATE users 
SET password_hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq3Ti'
WHERE username = 'admin';

-- Also update other users with proper hashes
UPDATE users 
SET password_hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq3Ti'
WHERE username IN ('manager', 'sales', 'user'); 