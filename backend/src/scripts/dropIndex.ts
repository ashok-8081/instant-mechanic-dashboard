import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/database';

dotenv.config();

const dropIndex = async () => {
    try {
        await connectDB();
        console.log('🔍 Dropping userId index...');
        
        const collection = mongoose.connection.collection('mechanics');
        await collection.dropIndex('userId_1');
        
        console.log('✅ Index dropped successfully!');
    } catch (error) {
        console.error('❌ Error dropping index:', error);
    } finally {
        await disconnectDB();
    }
};

dropIndex();