import { Router } from 'express';

// Local imports
import { registerController, loginController, refreshTokenController }
    from '../controllers/authController';

import { validateRegisterCredentials, validateLoginCredentials } 
    from '../middleware/validateCredentials';

import { validateRefreshToken } from '../middleware/authMiddleware';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', validateRegisterCredentials, registerController);

// POST /api/v1/auth/login
router.post('/login', validateLoginCredentials, loginController);

// POST /api/v1/auth/refresh-token
router.post('/refresh-token', validateRefreshToken, refreshTokenController);


export default router;