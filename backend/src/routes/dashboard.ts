import { Router } from 'express';
import { getDashboardOverview } from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

router.get('/', getDashboardOverview);

export default router;