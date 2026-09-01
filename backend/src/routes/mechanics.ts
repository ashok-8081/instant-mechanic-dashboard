import { Router } from 'express';
import { Mechanic } from '../models/Mechanic';
import { Booking } from '../models/Booking';

const router = Router();

// Helper function to broadcast updates (will be set from server)
let broadcastMechanicUpdate: (data: any) => void = () => {};

export const setBroadcastMechanicUpdate = (fn: (data: any) => void) => {
    broadcastMechanicUpdate = fn;
};

// GET all mechanics
router.get('/', async (req, res, next) => {
    try {
        const { status, search } = req.query;

        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (search) {
            where.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { specialization: { $regex: search, $options: 'i' } }
            ];
        }

        const mechanics = await Mechanic.find(where)
            .sort({ status: 1, name: 1 })
            .lean();

        // Get current booking for each mechanic
        const mechanicsWithBookings = await Promise.all(
            mechanics.map(async (mechanic) => {
                const currentBooking = await Booking.findOne({
                    mechanicId: mechanic._id,
                    status: { $in: ['ASSIGNED', 'MECHANIC_ON_WAY', 'IN_PROGRESS'] }
                })
                    .populate('customerId', 'name phone')
                    .populate('vehicleId', 'make model licensePlate')
                    .populate('serviceId', 'name')
                    .sort({ scheduledAt: 1 })
                    .lean();

                return {
                    ...mechanic,
                    currentBooking: currentBooking || null
                };
            })
        );

        res.json({
            success: true,
            data: mechanicsWithBookings
        });
    } catch (error) {
        next(error);
    }
});

// GET single mechanic
router.get('/:id', async (req, res, next) => {
    try {
        const mechanic = await Mechanic.findById(req.params.id).lean();

        if (!mechanic) {
            return res.status(404).json({
                success: false,
                message: 'Mechanic not found'
            });
        }

        const bookings = await Booking.find({ mechanicId: mechanic._id })
            .populate('customerId', 'name email phone')
            .populate('vehicleId', 'make model licensePlate')
            .populate('serviceId', 'name category')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        res.json({
            success: true,
            data: {
                ...mechanic,
                recentBookings: bookings
            }
        });
    } catch (error) {
        next(error);
    }
});

// CREATE new mechanic
router.post('/', async (req, res, next) => {
    try {
        const { name, email, phone, specialization, status, latitude, longitude } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !specialization) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, email, phone, specialization'
            });
        }

        // Check if mechanic already exists
        const existing = await Mechanic.findOne({
            email: String(email).trim()
        } as any);

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Mechanic with this email already exists'
            });
        }

        // Create the mechanic
        const mechanic = await Mechanic.create({
            name,
            email,
            phone,
            specialization,
            status: status || 'AVAILABLE',
            jobsCompleted: 0,
            rating: 0,
            latitude: latitude || null,
            longitude: longitude || null,
        });

        // Broadcast update via WebSocket if available
        try {
            broadcastMechanicUpdate(mechanic);
        } catch (error) {
            console.log('WebSocket broadcast not available');
        }

        res.status(201).json({
            success: true,
            data: mechanic,
            message: 'Mechanic created successfully'
        });

    } catch (error) {
        console.error('Error creating mechanic:', error);
        next(error);
    }
});

// UPDATE mechanic status
router.put('/:id/status', async (req, res, next) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const mechanic = await Mechanic.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).lean();

        if (!mechanic) {
            return res.status(404).json({
                success: false,
                message: 'Mechanic not found'
            });
        }

        try {
            broadcastMechanicUpdate(mechanic);
        } catch (error) {
            console.log('WebSocket broadcast not available');
        }

        res.json({
            success: true,
            data: mechanic
        });
    } catch (error) {
        next(error);
    }
});

// UPDATE mechanic location
router.put('/:id/location', async (req, res, next) => {
    try {
        const { latitude, longitude } = req.body;
        const { id } = req.params;

        const mechanic = await Mechanic.findByIdAndUpdate(
            id,
            { latitude, longitude },
            { new: true }
        ).lean();

        if (!mechanic) {
            return res.status(404).json({
                success: false,
                message: 'Mechanic not found'
            });
        }

        try {
            broadcastMechanicUpdate(mechanic);
        } catch (error) {
            console.log('WebSocket broadcast not available');
        }

        res.json({
            success: true,
            data: mechanic
        });
    } catch (error) {
        next(error);
    }
});

// DELETE mechanic
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const mechanic = await Mechanic.findByIdAndDelete(id);

        if (!mechanic) {
            return res.status(404).json({
                success: false,
                message: 'Mechanic not found'
            });
        }

        res.json({
            success: true,
            message: 'Mechanic deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

export default router;