import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
    customerId: mongoose.Types.ObjectId;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Define the schema
const VehicleSchema = new Schema<IVehicle>(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Customer'
        },
        make: {
            type: String,
            required: true
        },
        model: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        licensePlate: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        color: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Register the model - check if it exists first
let VehicleModel;
try {
    VehicleModel = mongoose.model('Vehicle');
} catch {
    VehicleModel = mongoose.model<IVehicle>('Vehicle', VehicleSchema);
}

export const Vehicle = VehicleModel;