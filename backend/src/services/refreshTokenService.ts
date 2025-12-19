import jwt from 'jsonwebtoken';
import { RefreshTokenRequest, RefreshTokenResponse } from '../types/user';
import { findUserByRefreshToken } from '../models/userModel';
import { config } from '../config/env';

export const refreshAccessToken = async (request: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const { refreshToken } = request;

    // Verify refresh token
    try {
        const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { _id: string; username: string };

        // Find user with this refresh token in database
        const user = await findUserByRefreshToken(refreshToken);

        if (!user) {
            throw new Error('Invalid refresh token');
        }

        // Verify token payload matches user
        if (user.id !== decoded._id) {
            throw new Error('Token user mismatch');
        }

        // Generate new access token
        const newAccessTokenOptions: any = {
            expiresIn: config.jwt.accessExpiration
        };

        const accessToken = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email
            },
            config.jwt.accessSecret,
            newAccessTokenOptions
        );

        return {
            accessToken
        };
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid or expired refresh token');
        }
        throw error;
    }
};
