import { Request, Response } from 'express';
import { Booking, BookingStatus } from '../models/Booking';
import { Mechanic, MechanicStatus } from '../models/Mechanic';
import mongoose from 'mongoose';

export const getBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            page = 1,
            limit = 20,
            search,
            status,
            dateFrom,
            dateTo,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        // Build filter
        const filter: any = {};

        if (status) {
            filter.status = status;
        }

        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom as string);
            if (dateTo) filter.createdAt.$lte = new Date(dateTo as string);
        }

        // If search, use aggregation
        if (search) {
            const bookings = await Booking.aggregate([
                {
                    $lookup: {
                        from: 'customers',
                        localField: 'customerId',
                        foreignField: '_id',
                        as: 'customer'
                    }
                },
                { $unwind: '$customer' },
                {
                    $lookup: {
                        from: 'vehicles',
                        localField: 'vehicleId',
                        foreignField: '_id',
                        as: 'vehicle'
                    }
                },
                { $unwind: '$vehicle' },
                {
                    $lookup: {
                        from: 'services',
                        localField: 'serviceId',
                        foreignField: '_id',
                        as: 'service'
                    }
                },
                { $unwind: '$service' },
                {
                    $lookup: {
                        from: 'mechanics',
                        localField: 'mechanicId',
                        foreignField: '_id',
                        as: 'mechanic'
                    }
                },
                { $unwind: { path: '$mechanic', preserveNullAndEmptyArrays: true } },
                {
                    $match: {
                        $or: [
                            { 'customer.name': { $regex: search, $options: 'i' } },
                            { 'customer.email': { $regex: search, $options: 'i' } },
                            { 'vehicle.licensePlate': { $regex: search, $options: 'i' } }
                        ]
                    }
                },
                {
                    $facet: {
                        metadata: [{ $count: 'total' }],
                        data: [
                            { $skip: skip },
                            { $limit: take },
                            { $sort: { [sortBy as string]: sortOrder === 'desc' ? -1 : 1 } }
                        ]
                    }
                }
            ]);

            const result = bookings[0];
            const total = result?.metadata?.[0]?.total || 0;

            res.json({
                success: true,
                data: result?.data || [],
                pagination: {
                    page: Number(page),
                    limit: take,
                    total,
                    pages: Math.ceil(total / take)
                }
            });
            return;
        }

        // If no search, use simple find with populate
        const bookings = await Booking.find(filter)
            .populate('customerId', 'name email phone')
            .populate('vehicleId', 'make model year licensePlate color')
            .populate('serviceId', 'name category basePrice duration')
            .populate('mechanicId', 'name email status rating jobsCompleted')
            .sort({ [sortBy as string]: sortOrder === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(take)
            .lean();

        const total = await Booking.countDocuments(filter);

        res.json({
            success: true,
            data: bookings,
            pagination: {
                page: Number(page),
                limit: take,
                total,
                pages: Math.ceil(total / take)
            }
        });
    } catch (error) {
        const err = error as Error;
        console.error('Error in getBookings:', err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getBookingById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid booking ID format'
            });
            return;
        }

        const booking = await Booking.findById(id)
            .populate('customerId', 'name email phone address')
            .populate('vehicleId', 'make model year licensePlate color')
            .populate('serviceId', 'name category basePrice duration')
            .populate('mechanicId', 'name email status rating jobsCompleted')
            .lean();

        if (!booking) {
            res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
            return;
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        const err = error as Error;
        console.error('Error in getBookingById:', err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid booking ID format'
            });
            return;
        }

        if (!Object.values(BookingStatus).includes(status)) {
            res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
            return;
        }

        const booking = await Booking.findByIdAndUpdate(
            id,
            {
                status,
                completedAt: status === BookingStatus.COMPLETED ? new Date() : undefined
            },
            { new: true }
        );

        if (!booking) {
            res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
            return;
        }

        // Populate the booking after update
        const populatedBooking = await Booking.findById(booking._id)
            .populate('customerId', 'name email')
            .populate('vehicleId', 'make model licensePlate')
            .populate('serviceId', 'name category')
            .populate('mechanicId', 'name email status')
            .lean();

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

        // Broadcast update via WebSocket
        try {
            const io = req.app.get('io');
            if (io) {
                io.emit('booking-update', populatedBooking);
                io.emit('dashboard-update', { type: 'booking', data: populatedBooking });
            }
        } catch (error) {
            console.log('WebSocket broadcast not available');
        }

        res.json({
            success: true,
            data: populatedBooking
        });
    } catch (error) {
        const err = error as Error;
        console.error('Error in updateBookingStatus:', err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            customerId,
            vehicleId,
            serviceId,
            mechanicId,
            scheduledAt,
            amount,
            note
        } = req.body;

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(customerId) ||
            !mongoose.Types.ObjectId.isValid(vehicleId) ||
            !mongoose.Types.ObjectId.isValid(serviceId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid ID format'
            });
            return;
        }

        const booking = await Booking.create({
            customerId,
            vehicleId,
            serviceId,
            mechanicId: mechanicId && mongoose.Types.ObjectId.isValid(mechanicId) ? mechanicId : undefined,
            scheduledAt: new Date(scheduledAt),
            amount,
            note,
            status: BookingStatus.PENDING
        });

        const populatedBooking = await Booking.findById(booking._id)
            .populate('customerId', 'name email')
            .populate('vehicleId', 'make model licensePlate')
            .populate('serviceId', 'name category')
            .populate('mechanicId', 'name email')
            .lean();

        // Broadcast new booking via WebSocket
        try {
            const io = req.app.get('io');
            if (io) {
                io.emit('booking-update', populatedBooking);
                io.emit('dashboard-update', { type: 'booking', data: populatedBooking });
            }
        } catch (error) {
            console.log('WebSocket broadcast not available');
        }

        res.status(201).json({
            success: true,
            data: populatedBooking
        });
    } catch (error) {
        const err = error as Error;
        console.error('Error in createBooking:', err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};