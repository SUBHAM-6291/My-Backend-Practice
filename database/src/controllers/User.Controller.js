// ------------------------- Imports aur Setup -------------------------
// asyncHandler: middleware hai jo async functions ko handle karta hai errors ko catch karke
import { asyncHandler } from "../utils/asynchandler.js";
// Custom Error Handler
import { ApiError } from "../utils/ApiError.js";
// User Model Database se
import { User } from "../models/User.Model.js";
// Cloudinary par files upload karne ka service
import { uploadOnCloudinary } from "../Service/Cloudinary.js";
// Response Handler
import { ApiResponse } from "../utils/ApiResponse.js";
// JWT for token generation
import jwt from "jsonwebtoken";
// MongoDB ke ObjectId handle karne ke liye
import mongoose from "mongoose";

// ------------------------- Token Generation Helper -------------------------
// Access aur Refresh tokens generate karne ka reusable function
const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        // User ko database se find karo
        const user = await User.findById(userId)
        // User model ke methods se tokens generate karo
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // Refresh token ko database mein save karo
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Token generate karne mein error aaya")
    }
}

// ------------------------- User Registration -------------------------
const registerUser = asyncHandler( async (req, res) => {
    // Frontend se data nikalna
    const {fullName, email, username, password } = req.body

    // Sab fields check karo khali na ho
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Saare fields required hai")
    }

    // Check karo user pehle se exist karta hai kya
    const existedUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existedUser) throw new ApiError(409, "User pehle se exist karta hai")

    // Avatar aur cover image handle karo
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath;
    if (req.files?.coverImage?.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    
    // Avatar required hai
    if (!avatarLocalPath) throw new ApiError(400, "Avatar file required hai")

    // Cloudinary par upload karo
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) throw new ApiError(400, "Avatar upload nahi hua")

    // Database mein user create karo
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", // Agar cover image nahi hai toh khali string
        email, 
        password,
        username: username.toLowerCase()
    })

    // Password aur refresh token hata ke response bhejo
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) throw new ApiError(500, "User create karne mein error aaya")

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User successfully register hua")
    )
} )

// ------------------------- User Login -------------------------
const loginUser = asyncHandler(async (req, res) =>{
    // Email ya username aur password lelo
    const {email, username, password} = req.body

    // Dono mein se kuch nahi aaya toh error
    if (!username && !email) throw new ApiError(400, "Username ya email required hai")

    // Database mein user dhoondo
    const user = await User.findOne({ $or: [{username}, {email}] })
    if (!user) throw new ApiError(404, "User exist nahi karta")

    // Password check karo
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) throw new ApiError(401, "Galat password hai")

    // Tokens generate karo
    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // Cookies set karo secure options ke saath
    const options = { httpOnly: true, secure: true }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {user: loggedInUser, tokens}, "Login successful"))
})

// ------------------------- User Logout -------------------------
const logoutUser = asyncHandler(async(req, res) => {
    // User ke refresh token ko database se hatao
    await User.findByIdAndUpdate(req.user._id, 
        { $unset: { refreshToken: 1 } }, // RefreshToken field delete karo
        { new: true }
    )

    // Cookies clear karo
    const options = { httpOnly: true, secure: true }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logout successful"))
})

// ------------------------- Refresh Access Token -------------------------
const refreshAccessToken = asyncHandler(async (req, res) => {
    // Cookie ya body se refresh token lelo
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request")

    try {
        // Token verify karo
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        if (!user) throw new ApiError(401, "Invalid refresh token")

        // Token match nahi karta toh error
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token expired ya used hai")
        }

        // Naye tokens generate karo
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
        const options = { httpOnly: true, secure: true }

        // Naye tokens cookies mein set karo
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(new ApiResponse(200, {accessToken, newRefreshToken}, "New tokens generate hue"))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

// ------------------------- Password Change -------------------------
const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user?._id)

    // Purana password check karo
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) throw new ApiError(400, "Purana password galat hai")

    // Naya password set karo aur save karo
    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res.status(200).json(new ApiResponse(200, {}, "Password change successful"))
})

// ------------------------- Current User Profile -------------------------
const getCurrentUser = asyncHandler(async(req, res) => {
    // req.user middleware se aaya hai (auth middleware)
    return res.status(200).json(new ApiResponse(200, req.user, "Current user mil gaya"))
})

// ------------------------- Update Account Details -------------------------
const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body
    if (!fullName || !email) throw new ApiError(400, "Saare fields required hai")

    // User ko update karo
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { fullName, email } },
        { new: true }
    ).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "Profile update successful"))
})

// ------------------------- Update Avatar -------------------------
const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) throw new ApiError(400, "Avatar file missing hai")

    // Cloudinary par upload karo
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) throw new ApiError(400, "Avatar upload nahi hua")

    // Database update karo
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { avatar: avatar.url } },
        { new: true }
    ).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "Avatar update successful"))
})

// ------------------------- Update Cover Image -------------------------
const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) throw new ApiError(400, "Cover image missing hai")

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage.url) throw new ApiError(400, "Cover image upload nahi hua")

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { coverImage: coverImage.url } },
        { new: true }
    ).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "Cover image update successful"))
})

// ------------------------- User Channel Profile -------------------------
const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {username} = req.params
    if (!username?.trim()) throw new ApiError(400, "Username missing hai")

    // Aggregation pipeline se channel details nikalna
    const channel = await User.aggregate([
        { $match: { username: username.toLowerCase() } },
        {
            $lookup: {
                from: "subscriptions", // Subscribers count ke liye
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions", // Subscribed channels count ke liye
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscribers" },
                channelsSubscribedToCount: { $size: "$subscribedTo" },
                isSubscribed: { 
                    $cond: { 
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true, 
                        else: false 
                    } 
                }
            }
        },
        { 
            $project: { // Sirf required fields dikhao
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])

    if (!channel?.length) throw new ApiError(404, "Channel exist nahi karta")
    return res.status(200).json(new ApiResponse(200, channel[0], "Channel details mil gaye"))
})

// ------------------------- Watch History -------------------------
const getWatchHistory = asyncHandler(async(req, res) => {
    // Aggregation pipeline se watch history nikalna
    const user = await User.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(req.user._id) } },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [ // Nested pipeline for video owner details
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [{ $project: { fullName: 1, username: 1, avatar: 1 } }]
                        }
                    },
                    { $addFields: { owner: { $first: "$owner" } } } // Owner object flatten karo
                ]
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(200, user[0].watchHistory, "Watch history mil gayi")
    )
})

// Export all controllers
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}