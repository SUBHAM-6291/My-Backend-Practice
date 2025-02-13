import { asyncHandler } from "../utils/asynchandler.js";  
import { Router } from "express";  
import { ApiError } from '../utils/ApiError.js';  
import { User } from "../models/User.Model.js";  
import { uploadOnCloudinary } from '../Service/Cloudinary.js';  
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();  

const registerUser = asyncHandler(async (req, res) => {  
  const { fullName, username, email, password } = req.body;

  console.log("email:", email);
  console.log("Uploaded Files:", req.files);

  if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({  
    $or: [{ username }, { email }]
  });

  if (existedUser) {
    throw new ApiError(409, "User or email already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path || null;  
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null; 

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  let avatar, coverImage;
  try {
    avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : null;
    coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;
  } catch (error) {
    throw new ApiError(500, "Failed to upload images to Cloudinary");
  }

  const user = await User.create({
    fullName, // Fixed field name
    avatar: avatar?.url || "",
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

router.route("/register").post(registerUser);

export { registerUser, router };  
