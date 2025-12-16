import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { registerSchema, loginSchema, refreshTokenSchema } from "../schemas/authSchemas";

export const validateRegisterCredentials =
    (req: Request, res: Response, next: NextFunction) => {
        try {
            registerSchema.parse(req.body);
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
                message: 'Error de validación.'
            });
        }
    }

export const validateLoginCredentials =
    (req: Request, res: Response, next: NextFunction) => {
        try {
            loginSchema.parse(req.body);
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
                message: 'Error de validación.'
            });
        }
    }