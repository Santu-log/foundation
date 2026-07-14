import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/adminProfileController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require admin authentication
router.use(protectAdmin);

// Get logged-in admin profile
router.get("/", getProfile);

// Update name & email
router.put("/", updateProfile);

// Change password
router.put("/password", changePassword);

export default router;