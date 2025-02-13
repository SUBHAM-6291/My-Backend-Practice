// Required modules import kar rahe hain
import express from 'express';  // Express framework import kiya
import cors from 'cors';  // CORS middleware import kiya (Cross-Origin Requests allow karne ke liye)
import cookieParser from 'cookie-parser'; // Cookies handle karne ke liye
import dotenv from 'dotenv'; // Environment variables (.env) ko load karne ke liye

dotenv.config(); // .env file se environment variables ko load kar diya

const app = express(); // Express ka instance create kiya

// Middleware setup kar rahe hain
app.use(cors({  
    origin: process.env.CORS_ORIGIN || "http://localhost:4000", // Frontend ka origin set kar rahe hain
    credentials: true  // Cookies aur authentication headers allow honge
}));

app.use(express.json({ limit: "16kb" }));  // JSON request body ka size limit 16KB tak rakha
app.use(express.urlencoded({ extended: true, limit: "16kb" }));  // URL-encoded data ko parse karne ke liye
app.use(express.static("public"));  // Static files serve karne ke liye "public" folder use hoga
app.use(cookieParser());  // Cookies ko easily access karne ke liye

// Routes import
import Register from './routes/User.Routes.js'; // User ke routes import kiye

// Routes define kiye
app.use("/api/v1/users", Register); // Users ke related API yahan handle hogi

export { app };  // app ko export kar diya taaki kahin aur use kiya ja sake