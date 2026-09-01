import { Router } from 'express';
import {
    getBookings,
    getBookingById,
    updateBookingStatus,
    createBooking
} from '../controllers/bookingController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getBookings);
router.get('/:id', getBookingById);
router.put('/:id/status', updateBookingStatus);
router.post('/', createBooking);

export default router;