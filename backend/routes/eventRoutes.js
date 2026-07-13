import express from "express";
import {
  getEvents,
  getEventById,
  registerForEvent,
  adminGetEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus,
} from "../controllers/eventController.js";
import { protectAdmin, optionalAuth } from "../middleware/authMiddleware.js";
import { uploadEvent } from "../config/cloudinary.js";

const router = express.Router();

// Public
router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/:id/register", optionalAuth, registerForEvent);

// Admin
router.get("/admin/all", protectAdmin, adminGetEvents);
router.post("/admin", protectAdmin, uploadEvent.single("image"), createEvent);
router.put("/admin/:id", protectAdmin, uploadEvent.single("image"), updateEvent);
router.delete("/admin/:id", protectAdmin, deleteEvent);
router.patch("/admin/:id/status", protectAdmin, updateEventStatus);

export default router;
