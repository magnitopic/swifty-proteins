import dotenv from 'dotenv';
dotenv.config();

// List of all required environment variables
const requiredEnvVars = [
    // JWT Configuration
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'JWT_ACCESS_EXPIRATION',
    'JWT_REFRESH_EXPIRATION',

    // Database Configuration
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_DB',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',

    // Server Configuration
    'BACKEND_PORT',
    'NODE_ENV',

    // Admin User Configuration
    'ADMIN_USERNAME',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD'
];

// Check for required environment variables at startup
const missingVars: string[] = [];

requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        missingVars.push(key);
    }
});

if (missingVars.length > 0) {
    console.error('❌ FATAL ERROR: Missing required environment variables:');
    missingVars.forEach(varName => {
        console.error(`   - ${varName}`);
    });
    throw new Error(`Missing ${missingVars.length} required environment variable(s). Please check your .env file.`);
}

console.log('✅ All required environment variables loaded successfully');

// Export typed configuration object
export const config = {
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET!,
        refreshSecret: process.env.JWT_REFRESH_SECRET!,
        accessExpiration: process.env.JWT_ACCESS_EXPIRATION!,
        refreshExpiration: process.env.JWT_REFRESH_EXPIRATION!
    },
    database: {
        host: process.env.POSTGRES_HOST!,
        port: parseInt(process.env.POSTGRES_PORT!),
        database: process.env.POSTGRES_DB!,
        user: process.env.POSTGRES_USER!,
        password: process.env.POSTGRES_PASSWORD!
    },
    server: {
        port: parseInt(process.env.BACKEND_PORT!),
        nodeEnv: process.env.NODE_ENV!,
        backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL || `http://localhost:${process.env.BACKEND_PORT}`
    },
    admin: {
        username: process.env.ADMIN_USERNAME!,
        email: process.env.ADMIN_EMAIL!,
        password: process.env.ADMIN_PASSWORD!
    }
} as const;

// Export type for type safety
export type Config = typeof config;