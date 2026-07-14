import express from "express";
import {
  submitContactMessage,
  adminGetContactMessages,
  adminGetContactMessageById,
  replyToContactMessage,
  deleteContactMessage,
} from "../controllers/contactController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/", submitContactMessage);

// Admin
router.get("/admin/all", protectAdmin, adminGetContactMessages);
router.get("/admin/:id", protectAdmin, adminGetContactMessageById);
router.post("/admin/:id/reply", protectAdmin, replyToContactMessage);
router.delete("/admin/:id", protectAdmin, deleteContactMessage);

export default router;
