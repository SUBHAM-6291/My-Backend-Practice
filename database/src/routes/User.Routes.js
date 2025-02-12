import { Router } from "express";
import { registerUser } from "../controllers/User.Controller.js"; // Update the path as needed
import { upload } from "../middlewares/Multer.middleware.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        {name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        },
    ]),
    registerUser);

export default router;
