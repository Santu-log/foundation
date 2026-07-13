import express from "express";
import {
  getCauses,
  getCauseBySlug,
  adminGetCauses,
  createCause,
  updateCause,
  deleteCause,
} from "../controllers/causeController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { uploadCause } from "../config/cloudinary.js";

const router = express.Router();

// Public
router.get("/", getCauses);
router.get("/:slug", getCauseBySlug);

// Admin
router.get("/admin/all", protectAdmin, adminGetCauses);
router.post("/admin", protectAdmin, uploadCause.single("image"), createCause);
router.put("/admin/:id", protectAdmin, uploadCause.single("image"), updateCause);
router.delete("/admin/:id", protectAdmin, deleteCause);

export default router;
