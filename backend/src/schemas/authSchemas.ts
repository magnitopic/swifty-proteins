import { z } from 'zod';

export const registerSchema = z.object({
    email: z
        .string({ required_error: 'Email is required.' })
        .email('Invalid email format.')
        .min(5, 'Email must be at least 5 characters.'),

    password: z
        .string({ required_error: 'Password is required.' })
        .min(6, 'Password must be at least 6 characters.')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
        .regex(/[0-9]/, 'Password must contain at least one number.'),

    username: z
        .string({ required_error: 'Username is required.' })
        .min(3, 'Username must be at least 3 characters.')
        .max(20, 'Username cannot be longer than 20 characters.')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, and hyphens.'),
});

export const loginSchema = z.object({
    username: z
        .string({ required_error: 'Username is required.' })
        .min(3, 'Username must be at least 3 characters.')
        .max(20, 'Username cannot be longer than 20 characters.')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, and hyphens.'),

    password: z
        .string({ required_error: 'Password is required.' })
        .min(1, 'Password is required.')
});


export const refreshTokenSchema = z.object({
    refreshToken: z
        .string({ required_error: 'Refresh token is required.' })
        .min(1, 'Refresh token cannot be empty.')
});


export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;