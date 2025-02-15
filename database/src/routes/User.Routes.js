import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/User.Controller.js"; // Update the path if necessary
import { upload } from "../middlewares/Multer.middleware.js";
import { verifyJwt } from "../middlewares/Auth.middleware.js";

const router = Router();

// Register User Route with Multer Middleware for file uploads
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registerUser
);

// Login User Route
router.route("/login").post(loginUser);

// Logout User Route (Fixed path)
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken)

export default router;
