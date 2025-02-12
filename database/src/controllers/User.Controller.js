import { asyncHandler } from "../utils/asynchandler.js";  
import { Router } from "express";  
import { ApiError } from '../utils/ApiError.js';  
import { User } from "../models/User.Model.js";  
import { uploadToCloudinary } from '../utils/cloudinary.js';  
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();  

const registerUser = asyncHandler(async (req, res) => {  
  const { fullname, username, email, password } = req.body;
  console.log("email", email);

  if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({  
    $or: [{ username }, { email }]
  });

  if (existedUser) {
    throw new ApiError(409, "User or email already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;  
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path; 

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // ✅ Cloudinary me images upload kar rahe hain
  const avatar = await uploadToCloudinary(avatarLocalPath);  
  const coverImage = coverImageLocalPath ? await uploadToCloudinary(coverImageLocalPath) : null; 

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});

// ✅ Register route define kar rahe hain
router.route("/register").post(registerUser);

export { registerUser, router };
