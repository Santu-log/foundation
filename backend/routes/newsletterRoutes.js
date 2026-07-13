import express from "express";
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
  adminGetSubscribers,
} from "../controllers/newsletterController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/subscribe", subscribeNewsletter);
router.post("/unsubscribe", unsubscribeNewsletter);
router.get("/admin/all", protectAdmin, adminGetSubscribers);

export default router;
