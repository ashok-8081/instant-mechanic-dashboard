import { Router } from 'express';
import {
    getMechanics,
    getMechanicById,
    updateMechanicStatus
} from '../controllers/mechanicController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getMechanics);
router.get('/:id', getMechanicById);
router.put('/:id/status', updateMechanicStatus);

export default router;