import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000", // Fallback value
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import Register from './routes/User.Routes.js';

// Routes declaration
app.use("/api/v1/users", Register);

export { app };
