import { Request, Response } from 'express';
import { Booking, BookingStatus } from '../models/Booking';
import { Customer } from '../models/Customer';
import { Mechanic, MechanicStatus } from '../models/Mechanic';

export const getDashboardOverview = async (req: Request, res: Response): Promise<void> => {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get all counts in parallel
        const [
            totalBookings,
            todayBookings,
            completedBookings,
            pendingBookings,
            cancelledBookings,
            totalRevenue,
            activeMechanics,
            newCustomers
        ] = await Promise.all([
            Booking.countDocuments(),
            Booking.countDocuments({
                createdAt: { $gte: today, $lt: tomorrow }
            }),
            Booking.countDocuments({ status: BookingStatus.COMPLETED }),
            Booking.countDocuments({ status: BookingStatus.PENDING }),
            Booking.countDocuments({ status: BookingStatus.CANCELLED }),
            Booking.aggregate([
                { $match: { status: BookingStatus.COMPLETED } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            Mechanic.countDocuments({ status: MechanicStatus.AVAILABLE }),
            Customer.countDocuments({
                createdAt: { $gte: today, $lt: tomorrow }
            })
        ]);

        // Get booking trends (last 7 days)
        const bookingTrends = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get revenue trends (last 7 days)
        const revenueTrends = await Booking.aggregate([
            {
                $match: {
                    status: BookingStatus.COMPLETED,
                    createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$amount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get booking status distribution
        const statusDistribution = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get service category breakdown
        const serviceBreakdown = await Booking.aggregate([
            {
                $match: {
                    status: BookingStatus.COMPLETED,
                    createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
                }
            },
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
                $group: {
                    _id: '$service.category',
                    count: { $sum: 1 },
                    revenue: { $sum: '$amount' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    totalBookings,
                    todayBookings,
                    completedBookings,
                    pendingBookings,
                    cancelledBookings,
                    totalRevenue: totalRevenue[0]?.total || 0,
                    activeMechanics,
                    newCustomers
                },
                trends: {
                    bookings: bookingTrends,
                    revenue: revenueTrends
                },
                breakdown: {
                    status: statusDistribution,
                    services: serviceBreakdown
                }
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