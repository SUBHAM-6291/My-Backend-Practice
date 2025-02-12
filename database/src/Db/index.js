import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
    try {
        console.log("MongoDB URI:", process.env.MONGODB_URI); // Debugging step

        // Corrected URI string interpolation
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log(`\nMongoDB connected: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
