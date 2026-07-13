import express from "express";
import {
  loginAdmin,
  getAdminMe,
  logoutAdmin,
  createAdmin,
} from "../controllers/adminAuthController.js";
import { protectAdmin, superAdminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", protectAdmin, getAdminMe);
router.post("/logout", protectAdmin, logoutAdmin);
router.post("/create", protectAdmin, superAdminOnly, createAdmin);

export default router;
