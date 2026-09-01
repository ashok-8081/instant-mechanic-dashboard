import mongoose, { Schema, Document } from 'mongoose';

export enum ServiceCategory {
    OIL_CHANGE = 'OIL_CHANGE',
    TIRE_REPLACEMENT = 'TIRE_REPLACEMENT',
    BRAKE_REPAIR = 'BRAKE_REPAIR',
    ENGINE_DIAGNOSTICS = 'ENGINE_DIAGNOSTICS',
    BATTERY_REPLACEMENT = 'BATTERY_REPLACEMENT',
    TRANSMISSION_REPAIR = 'TRANSMISSION_REPAIR',
    SUSPENSION_REPAIR = 'SUSPENSION_REPAIR',
    AC_SERVICE = 'AC_SERVICE',
    CAR_WASH = 'CAR_WASH',
    DETAILING = 'DETAILING',
    ELECTRICAL_REPAIR = 'ELECTRICAL_REPAIR',
    EXHAUST_REPAIR = 'EXHAUST_REPAIR',
    RADIATOR_REPAIR = 'RADIATOR_REPAIR',
    STARTER_REPAIR = 'STARTER_REPAIR',
    ALTERNATOR_REPAIR = 'ALTERNATOR_REPAIR'
}

export interface IService extends Document {
    name: string;
    category: ServiceCategory;
    description?: string;
    basePrice: number;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        category: {
            type: String,
            enum: Object.values(ServiceCategory),
            required: true
        },
        description: {
            type: String,
            trim: true
        },
        basePrice: {
            type: Number,
            required: true,
            min: 0
        },
        duration: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        timestamps: true
    }
);

let ServiceModel;
try {
    ServiceModel = mongoose.model('Service');
} catch {
    ServiceModel = mongoose.model<IService>('Service', ServiceSchema);
}

export const Service = ServiceModel;