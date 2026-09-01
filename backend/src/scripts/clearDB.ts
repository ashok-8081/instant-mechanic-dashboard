import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/database';

dotenv.config();

const clearDatabase = async () => {
    try {
        await connectDB();
        console.log('🗑️ Clearing all collections...');
        
        // Get all collection names
        const collections = await mongoose.connection.db.collections();
        
        // Drop each collection
        for (const collection of collections) {
            await collection.drop();
            console.log(`✅ Dropped collection: ${collection.collectionName}`);
        }
        
        console.log('✅ Database cleared successfully!');
    } catch (error) {
        console.error('❌ Error clearing database:', error);
    } finally {
        await disconnectDB();
    }
};

clearDatabase();