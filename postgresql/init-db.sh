#!/bin/sh
set -e

# Wait for PostgreSQL to be ready
until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

echo "PostgreSQL is ready. Running initialization script..."

# Execute SQL with environment variables
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create extension for UUID if not exists
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    
    -- Create users table
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

    -- Insert admin user from environment variables
    INSERT INTO users (username, email, password) 
    VALUES (
        '${ADMIN_USERNAME}',
        '${ADMIN_EMAIL}',
        '${ADMIN_PASSWORD_HASH}'
    ) ON CONFLICT (username) DO NOTHING;

    -- Show confirmation message
    DO \$\$
    BEGIN
        RAISE NOTICE 'Database initialized successfully!';
        RAISE NOTICE 'Table "users" created with UUID support';
        RAISE NOTICE 'Admin user created: %', '${ADMIN_USERNAME}';
    END \$\$;
EOSQL

echo "Database initialization complete!"
