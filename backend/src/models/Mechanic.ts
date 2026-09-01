import mongoose, { Schema, Document } from 'mongoose';

export enum MechanicStatus {
    AVAILABLE = 'AVAILABLE',
    BUSY = 'BUSY',
    ON_BREAK = 'ON_BREAK',
    OFFLINE = 'OFFLINE',
    ON_ROAD = 'ON_ROAD'
}

export interface IMechanic extends Document {
    userId: string;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    status: MechanicStatus;
    jobsCompleted: number;
    rating: number;
    latitude?: number;
    longitude?: number;
    currentJobId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const MechanicSchema = new Schema<IMechanic>(
    {
        userId: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: true
        },
        specialization: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(MechanicStatus),
            default: MechanicStatus.AVAILABLE
        },
        jobsCompleted: {
            type: Number,
            default: 0
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        },
        currentJobId: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

let MechanicModel;
try {
    MechanicModel = mongoose.model('Mechanic');
} catch {
    MechanicModel = mongoose.model<IMechanic>('Mechanic', MechanicSchema);
}

export const Mechanic = MechanicModel;