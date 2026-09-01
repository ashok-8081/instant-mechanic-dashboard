import { Request, Response } from 'express';
import { Customer } from '../models/Customer';
import { Booking } from '../models/Booking';

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search, page = 1, limit = 20 } = req.query;
        
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const filter: any = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        const [customers, total] = await Promise.all([
            Customer.find(filter)
                .skip(skip)
                .limit(take)
                .sort({ name: 1 })
                .lean(),
            Customer.countDocuments(filter)
        ]);

        // Get booking count for each customer
        const customersWithStats = await Promise.all(
            customers.map(async (customer) => {
                const bookingCount = await Booking.countDocuments({ 
                    customerId: customer._id 
                });
                const recentBookings = await Booking.find({ 
                    customerId: customer._id 
                })
                    .populate('serviceId', 'name')
                    .populate('mechanicId', 'name')
                    .sort({ createdAt: -1 })
                    .limit(3)
                    .lean();

                return {
                    ...customer,
                    totalBookings: bookingCount,
                    recentBookings
                };
            })
        );

        res.json({
            success: true,
            data: customersWithStats,
            pagination: {
                page: Number(page),
                limit: take,
                total,
                pages: Math.ceil(total / take)
            }
        });
    } catch (error) {
        const err = error as Error;
        console.error('Error in getCustomers:', err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
    try {
        const customer = await Customer.findById(req.params.id).lean();

        if (!customer) {
            res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
            return;
        }

        const bookings = await Booking.find({ customerId: customer._id })
            .populate('vehicleId', 'make model licensePlate')
            .populate('serviceId', 'name category')
            .populate('mechanicId', 'name')
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            success: true,
            data: {
                ...customer,
                bookings
            }
        });
    } catch (error) {
        const err = error as Error;
        console.error('Error in getCustomerById:', err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};