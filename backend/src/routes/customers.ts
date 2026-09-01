import { Router } from 'express';
import { Booking, BookingStatus } from '../models/Booking';
import { Mechanic, MechanicStatus } from '../models/Mechanic';

const router = Router();

// Helper for broadcasting
let broadcastBookingUpdate: (data: any) => void = () => {};

export const setBroadcastBookingUpdate = (fn: (data: any) => void) => {
    broadcastBookingUpdate = fn;
};

// ... rest of your booking routes ...

// When updating status, call broadcast
router.put('/:id/status', async (req, res, next) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!Object.values(BookingStatus).includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const booking = await Booking.findByIdAndUpdate(
            id,
            {
                status,
                completedAt: status === BookingStatus.COMPLETED ? new Date() : undefined
            },
            { new: true }
        )
            .populate('customerId', 'name email')
            .populate('vehicleId', 'make model licensePlate')
            .populate('serviceId', 'name category')
            .populate('mechanicId', 'name email status')
            .lean();

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Update mechanic status if assigned
        if (booking.mechanicId && status === BookingStatus.IN_PROGRESS) {
            await Mechanic.findByIdAndUpdate(booking.mechanicId, {
                status: MechanicStatus.BUSY
            });
        }

        // If completed, increment mechanic's jobs
        if (status === BookingStatus.COMPLETED && booking.mechanicId) {
            await Mechanic.findByIdAndUpdate(booking.mechanicId, {
                $inc: { jobsCompleted: 1 }
            });
        }

        // Broadcast update
        try {
            broadcastBookingUpdate(booking);
        } catch (error) {
            console.log('WebSocket broadcast not available');
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
});

export default router;