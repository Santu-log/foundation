import express from "express";
import {
  getTestimonials,
  submitTestimonial,
  adminGetTestimonials,
  adminCreateTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { uploadTestimonial } from "../config/cloudinary.js";

const router = express.Router();

// Public
router.get("/", getTestimonials);
router.post("/", uploadTestimonial.single("photo"), submitTestimonial);

// Admin
router.get("/admin/all", protectAdmin, adminGetTestimonials);
router.post("/admin", protectAdmin, uploadTestimonial.single("photo"), adminCreateTestimonial);
router.put("/admin/:id", protectAdmin, uploadTestimonial.single("photo"), updateTestimonial);
router.delete("/admin/:id", protectAdmin, deleteTestimonial);

export default router;
