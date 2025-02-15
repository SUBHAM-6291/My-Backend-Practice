import mongoose, { Schema } from "mongoose"; 
import jwt from "jsonwebtoken";  
import bcrypt from "bcryptjs";  

// ✅ Define User Schema
const userSchema = new Schema({
    username: {
        type: String, 
        required: true,
        unique: true,
        trim: true,
        lowercase: true, // ✅ Ensures usernames are case-insensitive
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true, 
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, 
        default: "" 
    },
    coverImage: {
        type: String 
    },
    watchHistory: [{  
        type: Schema.Types.ObjectId,  
        ref: "Video" 
    }],
    password: {
        type: String,
        required: [true, "Password is required"]


    },

    //har kisko file uplod nhi kiya ja sajta refersh database store refersh token data base same mandwali karlenge 

    refreshToken: {//long term j
        type: String 
    }
}, { timestamps: true });

// ✅ Middleware to hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// ✅ Method to check if password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// ✅ Method to generate Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }
    );
};

// ✅ Method to generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d" }
    );
};

// ✅ Create Mongoose model
export const User = mongoose.model("User", userSchema);
