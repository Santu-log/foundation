import express from "express";
import {
  applyVolunteer,
  adminGetVolunteers,
  adminGetVolunteerById,
  updateVolunteerStatus,
  assignVolunteerToEvent,
} from "../controllers/volunteerController.js";
import { protectAdmin, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public / optional-auth
router.post("/", optionalAuth, applyVolunteer);

// Admin
router.get("/admin/all", protectAdmin, adminGetVolunteers);
router.get("/admin/:id", protectAdmin, adminGetVolunteerById);
router.patch("/admin/:id/status", protectAdmin, updateVolunteerStatus);
router.patch("/admin/:id/assign", protectAdmin, assignVolunteerToEvent);

export default router;
