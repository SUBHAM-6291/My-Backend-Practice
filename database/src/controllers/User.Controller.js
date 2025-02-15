import { asyncHandler } from "../utils/asynchandler.js";
import { Router } from "express";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.Model.js";
import { uploadOnCloudinary } from "../Service/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const router = Router();

// ********** Generate Access & Refresh Tokens **********
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

// ********** Register User Route **********
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

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
    fullName,
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

  return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// ********** Login User Route **********
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "Username, email, and password are required");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

// ********** Logout User Route **********
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// ********** Refresh Access Token Route **********
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized: No refresh token provided");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decodedToken?._id);
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or has already been used");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed successfully"));
});

// ********** Export Routes **********
export { registerUser, loginUser, logoutUser, refreshAccessToken, router };
 