import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
    name: string;
    email: string;
    phone: string;
    address?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
    {
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
        address: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

let CustomerModel;
try {
    CustomerModel = mongoose.model('Customer');
} catch {
    CustomerModel = mongoose.model<ICustomer>('Customer', CustomerSchema);
}

export const Customer = CustomerModel;