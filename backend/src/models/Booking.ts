import mongoose, { Schema, Document } from 'mongoose';

export enum BookingStatus {
    PENDING = 'PENDING',
    ASSIGNED = 'ASSIGNED',
    MECHANIC_ON_WAY = 'MECHANIC_ON_WAY',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export interface IBooking extends Document {
    customerId: mongoose.Types.ObjectId;
    vehicleId: mongoose.Types.ObjectId;
    serviceId: mongoose.Types.ObjectId;
    mechanicId?: mongoose.Types.ObjectId;
    status: BookingStatus;
    amount: number;
    scheduledAt: Date;
    completedAt?: Date;
    note?: string;
    assignedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Customer'
        },
        vehicleId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Vehicle'
        },
        serviceId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Service'
        },
        mechanicId: {
            type: Schema.Types.ObjectId,
            ref: 'Mechanic'
        },
        status: {
            type: String,
            enum: Object.values(BookingStatus),
            default: BookingStatus.PENDING
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        scheduledAt: {
            type: Date,
            required: true
        },
        completedAt: {
            type: Date
        },
        note: {
            type: String,
            trim: true
        },
        assignedBy: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// Create indexes
BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ customerId: 1 });
BookingSchema.index({ mechanicId: 1 });
BookingSchema.index({ scheduledAt: 1 });

let BookingModel;
try {
    BookingModel = mongoose.model('Booking');
} catch {
    BookingModel = mongoose.model<IBooking>('Booking', BookingSchema);
}

export const Booking = BookingModel;