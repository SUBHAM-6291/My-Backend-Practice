import mongoose, { Schema } from "mongoose"; // Import Mongoose and Schema for defining MongoDB models
import jwt from "jsonwebtoken"; // Import JSON Web Token for authentication
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing


// Define User Schema
const userSchema = new Schema({
    username: {
        type: String, // Data type is String
        required: true, // Username is required
        unique: true, // Must be unique
        trim: true, // Remove extra spaces
        index: true // Create an index for faster search
    },
    email: {
        type: String,
        required: true,
        unique: true, // Each email should be unique
        lowercase: true, // Convert email to lowercase
        trim: true // Remove extra spaces
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true // Indexed for efficient search
    },
    avatar: {
        type: String, // Stores the profile picture URL (Cloudinary)
        default: "" // Default is an empty string if not provided
    },
    coverImage: {
        type: String // Stores the cover image URL
    },
    watchHistory: {
        type: Schema.Types.ObjectId, // Stores reference to a Video document
        ref: "Video" // This refers to the Video model in MongoDB
    },
    password: {
        type: String,
        required: [true, "Password is required"] // Custom error message if missing
    },
    refreshToken: {
        type: String // Stores the refresh token for authentication
    }
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` timestamps

// Middleware to hash password before saving user data
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // If password is not modified, move to next middleware
    this.password = await bcrypt.hash(this.password, 10); // Hash password with bcrypt (salt rounds: 10)
    next(); // Continue execution
});

// Method to check if the entered password matches the stored hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password); // Compare entered password with hashed password
};

// Method to generate an Access Token (JWT) for user authentication
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id, // User ID
            email: this.email, // User email
            username: this.username, // Username
            fullName: this.fullName // Full name
        },
        process.env.ACCESS_TOKEN_SECRET, // Secret key from .env file
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" } // Token expiration time
    );
};

// Method to generate a Refresh Token (JWT) for renewing authentication sessions
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id }, // Only User ID is included in refresh token
        process.env.REFRESH_TOKEN_SECRET, // Secret key from .env file
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d" } // Expiry time (default: 10 days)
    );
};

// Create a Mongoose model named "User" based on the schema
export const User = mongoose.model("User", userSchema);
