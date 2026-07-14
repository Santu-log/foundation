import express from "express";
import { getUserDashboard, updateUserProfile } from "../controllers/userController.js";
import { protectUser } from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../config/cloudinary.js";

const router = express.Router();

router.get("/dashboard", protectUser, getUserDashboard);
router.put("/profile", protectUser, uploadAvatar.single("avatar"), updateUserProfile);

export default router;
