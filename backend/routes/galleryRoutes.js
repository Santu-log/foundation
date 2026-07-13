import express from "express";
import {
  getGallery,
  uploadImages,
  updateImage,
  deleteImage,
} from "../controllers/galleryController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { uploadGallery } from "../config/cloudinary.js";

const router = express.Router();

// Public
router.get("/", getGallery);

// Admin
router.post("/admin", protectAdmin, uploadGallery.array("images", 20), uploadImages);
router.put("/admin/:id", protectAdmin, updateImage);
router.delete("/admin/:id", protectAdmin, deleteImage);

export default router;
