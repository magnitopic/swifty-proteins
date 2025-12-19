import { Pool } from 'pg';
import { config } from './env';

// Database connection configuration
const pool = new Pool({
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    user: config.database.user,
    password: config.database.password,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Initialize admin user after database connection
const initializeAdminUser = async () => {
    try {
        // Import registerUser service dynamically to avoid circular dependencies
        const { registerUser } = await import('../services/registerService');

        // Check if admin user already exists
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2',
            [config.admin.username, config.admin.email]
        );

        if (result.rows.length === 0) {
            console.log('Creating admin user...');
            await registerUser({
                username: config.admin.username,
                email: config.admin.email,
                password: config.admin.password
            });
            console.log(`Admin user created successfully: ${config.admin.username}`);
        } else {
            console.log(`Admin user already exists: ${config.admin.username}`);
        }
    } catch (error) {
        console.error('❌Error initializing admin user:', error);
        // Don't exit the process, just log the error
    }
};

// Test database connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err: Error) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
    process.exit(-1);
});

// Export query function for easy use
export const query = (text: string, params?: any[]) => pool.query(text, params);

// Export initialization function
export const initDB = initializeAdminUser;

// Export pool for advanced use cases
export default pool;
