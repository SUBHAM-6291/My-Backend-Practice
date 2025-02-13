import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { DB_NAME } from '../constants.js';

dotenv.config();

// MongoDB URI ko log kar rahe hain taaki confirm ho sake ki environment variable sahi se read ho raha hai
console.log("MongoDB URI:", process.env.MONGODB_URI);  

const connectDB = async () => {
    try {
        // Mongoose ka connect method use karke database se connection establish kar rahe hain
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: DB_NAME,  // Specific database ka naam define kar rahe hain
            useNewUrlParser: true,  // Deprecated warnings avoid karne ke liye ye options use ho raha hai
            useUnifiedTopology: true, // Stable connection ke liye unified topology use ho raha hai
        });

        // Agar connection successful hota hai toh host ka naam console par print hoga
        console.log(`\nMongoDB connected: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        // Agar connection fail hota hai toh error message console par print hoga
        console.log(`MongoDB connection error: ${error.message}`);
        process.exit(1); // Process ko exit kar dena taaki application bina DB ke na chale
    }
};

// is function ko import karke kahin bhi database connect kar sakte hain
export default connectDB;
