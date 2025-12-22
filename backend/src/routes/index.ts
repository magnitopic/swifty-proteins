import { Router } from 'express';

import authRoutes from './authRoutes';
import pdbRoutes from './pdbRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/pdb', pdbRoutes);

export default router;