import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

// Local imports
import { LoginCredentials, LoginResponse } from '../types/user';
import { findUserByUsername, updateRefreshToken } from '../models/userModel';
import { config } from '../config/env';

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { username, password } = credentials;

    // Find user by username using userModel
    const user = await findUserByUsername(username);

    if (!user) {
        throw new Error('Invalid username or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
        throw new Error('Invalid username or password');
    }

    // Generate Access Token (short-lived)
    const accessTokenOptions: any = {
        expiresIn: config.jwt.accessExpiration
    };

    const accessToken = jwt.sign(
        {
            _id: user.id,
            username: user.username,
            email: user.email
        },
        config.jwt.accessSecret,
        accessTokenOptions
    );

    // Generate Refresh Token (long-lived)
    const refreshTokenOptions: any = {
        expiresIn: config.jwt.refreshExpiration
    };

    const refreshToken = jwt.sign(
        {
            _id: user.id,
            username: user.username,
            email: user.email
        },
        config.jwt.refreshSecret,
        refreshTokenOptions
    );

    // Store refresh token in database
    await updateRefreshToken(user.id, refreshToken);

    // Remove password and refresh_token from user response
    const { password: _, refresh_token: __, ...userWithoutSensitiveData } = user;

    return {
        user: userWithoutSensitiveData,
        accessToken,
        refreshToken
    };
};
