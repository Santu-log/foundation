import asyncHandler from "express-async-handler";
import Newsletter from "../models/Newsletter.js";

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const existing = await Newsletter.findOne({ email });
  if (existing) {
    if (!existing.isActive) {
      existing.isActive = true;
      await existing.save();
    }
    return res.json({ success: true, message: "You are already subscribed" });
  }
  await Newsletter.create({ email });
  res.status(201).json({ success: true, message: "Subscribed successfully" });
});

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
export const unsubscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await Newsletter.findOneAndUpdate({ email }, { isActive: false });
  res.json({ success: true, message: "Unsubscribed successfully" });
});

// ---------------- Admin ----------------

// @desc    Get all newsletter subscribers
// @route   GET /api/admin/newsletter
// @access  Private (admin)
export const adminGetSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Newsletter.find({ isActive: true }).sort({ createdAt: -1 });
  res.json({ success: true, count: subscribers.length, subscribers });
});
