import express from "express";
import {
  createDonationOrder,
  verifyDonationPayment,
  getDonationReceipt,
  adminGetDonations,
  exportDonationsCsv,
  exportDonationsExcel,
  exportDonationsPdf,
} from "../controllers/donationController.js";
import { protectAdmin, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/create-order", optionalAuth, createDonationOrder);
router.post("/verify", verifyDonationPayment);
router.get("/:id/receipt", getDonationReceipt);

// Admin
router.get("/admin/all", protectAdmin, adminGetDonations);
router.get("/admin/export/csv", protectAdmin, exportDonationsCsv);
router.get("/admin/export/excel", protectAdmin, exportDonationsExcel);
router.get("/admin/export/pdf", protectAdmin, exportDonationsPdf);

export default router;
