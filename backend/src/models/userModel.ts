// Local imports
import { query } from '../config/db';
import { User, CreateUserDTO } from '../types/user';

// Find user by email or username (for validation)
export const findUserByEmailOrUsername = async (email: string, username: string): Promise<User | null> => {
    const text = `
        SELECT * FROM users 
        WHERE email = $1 OR username = $2
    `;
    const values = [email, username];

    const result = await query(text, values);

    if (result.rows.length > 0) {
        return result.rows[0];
    }
    return null;
};

// Find user by username only (for login)
export const findUserByUsername = async (username: string): Promise<User | null> => {
    const text = `
        SELECT * FROM users 
        WHERE username = $1
    `;
    const values = [username];

    const result = await query(text, values);

    if (result.rows.length > 0) {
        return result.rows[0];
    }
    return null;
};

// Create user in DB
export const createUserInDB = async (user: CreateUserDTO): Promise<User> => {
    const { email, username, password } = user;

    const text = `
        INSERT INTO users (email, username, password) 
        VALUES ($1, $2, $3) 
        RETURNING id, email, username, created_at
    `;

    const values = [email, username, password];

    const result = await query(text, values);
    return result.rows[0];
};

// Update user's refresh token in DB
export const updateRefreshToken = async (userId: string, refreshToken: string): Promise<void> => {
    const text = `
        UPDATE users 
        SET refresh_token = $1 
        WHERE id = $2
    `;
    const values = [refreshToken, userId];

    await query(text, values);
};

// Find user by refresh token
export const findUserByRefreshToken = async (refreshToken: string): Promise<User | null> => {
    const text = `
        SELECT * FROM users 
        WHERE refresh_token = $1
    `;
    const values = [refreshToken];

    const result = await query(text, values);

    if (result.rows.length > 0) {
        return result.rows[0];
    }
    return null;
};

// Clear user's refresh token (for logout)
export const clearRefreshToken = async (userId: string): Promise<void> => {
    const text = `
        UPDATE users 
        SET refresh_token = NULL 
        WHERE id = $1
    `;
    const values = [userId];

    await query(text, values);
};