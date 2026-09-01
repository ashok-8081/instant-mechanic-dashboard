import { Request, Response } from 'express';
import { Mechanic } from '../models/Mechanic';
import { Booking, BookingStatus } from '../models/Booking';

export const getMechanics = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status, search } = req.query;

        const filter: any = {};

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { specialization: { $regex: search, $options: 'i' } }
            ];
        }

        const mechanics = await Mechanic.find(filter)
            .sort({ status: 1, name: 1 })
            .lean();

        // Get current booking for each mechanic
        const mechanicsWithBookings = await Promise.all(
            mechanics.map(async (mechanic) => {
                const currentBooking = await Booking.findOne({
                    mechanicId: mechanic._id,
                    status: { $in: [BookingStatus.ASSIGNED, BookingStatus.MECHANIC_ON_WAY, BookingStatus.IN_PROGRESS] }
                } as any)
                    .populate('customerId', 'name phone')
                    .populate('vehicleId', 'make model licensePlate')
                    .populate('serviceId', 'name')
                    .sort({ scheduledAt: 1 });

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
        const err = error as Error;
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getMechanicById = async (req: Request, res: Response): Promise<void> => {
    try {
        const mechanic = await Mechanic.findById(req.params.id).lean();

        if (!mechanic) {
            res.status(404).json({
                success: false,
                message: 'Mechanic not found'
            });
            return;
        }

        const bookings = await Booking.find({ mechanic: mechanic._id })
            .populate('customerId', 'name email phone')
            .populate('vehicleId', 'make model licensePlate')
            .populate('serviceId', 'name category')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            success: true,
            data: {
                ...mechanic,
                recentBookings: bookings
            }
        });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const updateMechanicStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const mechanic = await Mechanic.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).lean();

        if (!mechanic) {
            res.status(404).json({
                success: false,
                message: 'Mechanic not found'
            });
            return;
        }

        res.json({
            success: true,
            data: mechanic
        });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};