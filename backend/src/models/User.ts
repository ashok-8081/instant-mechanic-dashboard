import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
    ADMIN = 'ADMIN',
    OPERATIONS = 'OPERATIONS',
    MECHANIC = 'MECHANIC'
}

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.OPERATIONS
        }
    },
    {
        timestamps: true
    }
);

let UserModel;
try {
    UserModel = mongoose.model('User');
} catch {
    UserModel = mongoose.model<IUser>('User', UserSchema);
}

export const User = UserModel;