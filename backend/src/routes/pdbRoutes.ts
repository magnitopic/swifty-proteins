import { Router } from 'express';
import { getPdbFileController } from '../controllers/pdbController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.get('/:ligand_id', authenticateJWT, getPdbFileController);

export default router;
