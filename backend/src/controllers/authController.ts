import { Request, Response } from 'express';
import { registerUser } from '../services/registerService';
import { loginUser } from '../services/loginService';
import { refreshAccessToken } from '../services/refreshTokenService';

export const registerController = async (req: Request, res: Response): Promise<void> => {
    const { email, password, username } = req.body;

    try {
        const user = await registerUser({ email, password, username });

        res.status(201).json({
            message: 'User registered successfully.',
            user: user
        });

    } catch (error: unknown) {
        const err = error as Error & { status?: number };

        if (err.message?.includes('already exists')) {
            res.status(409).json({
                message: err.message
            });
            return;
        } else if (err.status === 400) {
            res.status(400).json({
                message: err.message
            });
            return;
        }

        console.error('Registration Failed: ', error);
        res.status(500).json({
            message: 'Server error during registration. Please try again later.'
        });
    }
}

export const loginController = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const { user, accessToken, refreshToken } = await loginUser({ username, password });

        res.status(200).json({
            message: 'User logged in successfully.',
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (error: unknown) {
        const err = error as Error;

        if (err.message === 'Invalid username or password') {
            res.status(401).json({
                message: err.message
            });
            return;
        }

        if (err.message === 'Server configuration error') {
            res.status(500).json({
                message: err.message
            });
            return;
        }

        console.error('Login Failed:', error);
        res.status(500).json({
            message: 'Server error during login. Please try again later.'
        });
    }
}

export const refreshTokenController = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    try {
        const { accessToken } = await refreshAccessToken({ refreshToken });

        res.status(200).json({
            message: 'Access token refreshed successfully.',
            accessToken: accessToken
        });
    } catch (error: unknown) {
        const err = error as Error;

        if (err.message.includes('Invalid') || err.message.includes('expired')) {
            res.status(401).json({
                message: err.message
            });
            return;
        }

        if (err.message === 'Server configuration error') {
            res.status(500).json({
                message: err.message
            });
            return;
        }

        console.error('Token Refresh Failed:', error);
        res.status(500).json({
            message: 'Server error during token refresh. Please try again later.'
        });
    }
}