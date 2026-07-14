import express from "express";
import {
  getDashboardOverview,
  getMonthlyDonationsChart,
  getVolunteerGrowthChart,
  getEventParticipationChart,
} from "../controllers/dashboardController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protectAdmin);
router.get("/overview", getDashboardOverview);
router.get("/charts/donations", getMonthlyDonationsChart);
router.get("/charts/volunteers", getVolunteerGrowthChart);
router.get("/charts/events", getEventParticipationChart);

export default router;
