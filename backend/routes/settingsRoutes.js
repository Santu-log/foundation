import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { uploadHomepage } from "../config/cloudinary.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/admin", protectAdmin, uploadHomepage.single("heroImage"), updateSettings);

export default router;
