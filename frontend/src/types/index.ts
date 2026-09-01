export interface User {
    _id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'OPERATIONS' | 'MECHANIC';
}

export interface Booking {
    _id: string;
    customerId: {
        _id: string;
        name: string;
        email: string;
        phone: string;
    };
    vehicleId: {
        _id: string;
        make: string;
        model: string;
        year: number;
        licensePlate: string;
        color: string;
    };
    serviceId: {
        _id: string;
        name: string;
        category: string;
        basePrice: number;
        duration: number;
    };
    mechanicId?: {
        _id: string;
        name: string;
        email: string;
        status: string;
        jobsCompleted: number;
        rating: number;
    };
    status: 'PENDING' | 'ASSIGNED' | 'MECHANIC_ON_WAY' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    amount: number;
    scheduledAt: string;
    completedAt?: string;
    note?: string;
    createdAt: string;
}

export interface DashboardStats {
    overview: {
        totalBookings: number;
        todayBookings: number;
        completedBookings: number;
        pendingBookings: number;
        cancelledBookings: number;
        totalRevenue: number;
        activeMechanics: number;
        newCustomers: number;
    };
    trends: {
        bookings: Array<{ _id: string; count: number }>;
        revenue: Array<{ _id: string; revenue: number }>;
    };
    breakdown: {
        status: Array<{ _id: string; count: number }>;
        services: Array<{ _id: string; count: number; revenue: number }>;
    };
}

export interface Mechanic {
    _id: string;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    status: 'AVAILABLE' | 'BUSY' | 'ON_BREAK' | 'OFFLINE' | 'ON_ROAD';
    jobsCompleted: number;
    rating: number;
    currentBooking?: Booking;
}