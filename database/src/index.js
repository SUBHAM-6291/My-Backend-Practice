
















// 1. 'dotenv' package import kiya hai taaki environment variables ko manage kar sake
import dotenv from "dotenv"; 

// 2. Database connection function import kiya 'Db' directory se
import connectDB from "./Db/index.js"; 

// 3. Express application instance import kiya 'app.js' se
import { app } from './app.js'; 

// 4. Environment variables load kar rahe hain '.env' file se
dotenv.config({
    path: './.env'
});

// 5. MongoDB database se connection establish kar rahe hain
connectDB()
    .then(() => {
        // 6. Server start kar rahe hain jo ki environment variables me di gayi PORT pe chalega, warna default 8000 pe
        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        // 7. Agar database connection fail ho jaye to error message print karenge
        console.log("MONGO db connection failed !!! ", err);
    });


// ------------------------------------
// Neeche ek aur approach hai jo ki IIFE (Immediately Invoked Function Expression) ka use karta hai

// . 'mongoose' import kiya hai MongoDB ke saath interact karne ke liye
/*import mongoose from 'mongoose';

// Database name import kiya 'constants.js' se
import { DB_NAME } from './constants.js';

// 'express' import kiya taaki web server bana sake
import express from 'express';

// 'dotenv' import kiya aur configure kiya taaki environment variables load ho sake
import dotenv from 'dotenv';
dotenv.config();

// Ek Express application instance banaya
const app = express();

// IIFE use karke MongoDB se connect ho rahe hain aur server turant start kar rahe hain
(async () => {
    try {
        // MongoDB se connect ho rahe hain URI ko environment variables se leke
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        // Agar application me koi error aata hai to usko log karenge
        app.on("error", (error) => {
            console.log(`error ${error}`);
        });

        // Server start kar rahe hain jo ki environment variables me di gayi PORT pe chalega
        app.listen(process.env.PORT, () => {
            console.log(`app is listening on port ${process.env.PORT}`);
        });

    } catch (error) {
        // Agar database connection ya server start karne me koi error aata hai to usko log karenge
        console.log(`ERROR ${error}`);
        throw error;
    }
})(); */




