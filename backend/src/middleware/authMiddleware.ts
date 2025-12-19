import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { refreshTokenSchema } from '../schemas/authSchemas';
import { ZodError } from 'zod';

// Extend Request interface to include user property
export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Find the header "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied: No token provided' });
    }

    // Verify the token
    jwt.verify(token, config.jwt.accessSecret, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ message: 'Token is invalid or expired' });
        }

        // Save user data in request for controller to use
        req.user = user;

        // NEXT() is vital: Allows passing to the next step (the controller)
        next();
    });
};


export const validateRefreshToken =
    (req: Request, res: Response, next: NextFunction) => {
        try {
            refreshTokenSchema.parse(req.body);
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map(err => err.message);
                return res.status(400).json({
                    message: errorMessages[0],
                    errors: errorMessages
                });
            }
            return res.status(500).json({
                message: 'Validation error.'
            });
        }
    }