-- Create extension for UUID if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    username VARCHAR(255) NOT NULL UNIQUE,
    -- Username validation
    CONSTRAINT username_check CHECK (
        length(username) >= 3 AND 
        length(username) <= 20 AND
        username ~ '^[a-zA-Z0-9_-]+$'
    ),

    email VARCHAR(255) NOT NULL UNIQUE,

    -- Email validation
    CONSTRAINT email_check CHECK (
        length(email) >= 5 AND 
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),

    password VARCHAR(255) NOT NULL,

    -- Password validation
    CONSTRAINT password_hash_check CHECK (
        -- bcrypt hash always has 60 characters
        length(password) = 60 AND 
        -- And always starts with the algorithm identifier $2
        password LIKE '$2%'
    ),

    refresh_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Show confirmation message
DO $$
BEGIN
    RAISE NOTICE 'Database initialized successfully!';
    RAISE NOTICE 'Table "users" created with UUID support';
END $$;
