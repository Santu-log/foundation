import asyncHandler from "express-async-handler";
import Cause from "../models/Cause.js";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

// @desc    Get all active causes (public)
// @route   GET /api/causes
// @access  Public
export const getCauses = asyncHandler(async (req, res) => {
  const causes = await Cause.find({ isActive: true }).sort({ createdAt: -1 });
  res.json({ success: true, count: causes.length, causes });
});

// @desc    Get single cause by slug
// @route   GET /api/causes/:slug
// @access  Public
export const getCauseBySlug = asyncHandler(async (req, res) => {
  const cause = await Cause.findOne({ slug: req.params.slug });
  if (!cause) {
    res.status(404);
    throw new Error("Cause not found");
  }
  res.json({ success: true, cause });
});

// ---------------- Admin ----------------

export const adminGetCauses = asyncHandler(async (req, res) => {
  const causes = await Cause.find().sort({ createdAt: -1 });
  res.json({ success: true, count: causes.length, causes });
});

export const createCause = asyncHandler(async (req, res) => {
  const { title, description, goalAmount } = req.body;
  const slug = slugify(title) + "-" + Date.now().toString().slice(-5);
  const data = { title, slug, description, goalAmount };
  if (req.file) {
    data.image = req.file.path;
    data.imagePublicId = req.file.filename;
  }
  const cause = await Cause.create(data);
  res.status(201).json({ success: true, cause });
});

export const updateCause = asyncHandler(async (req, res) => {
  const cause = await Cause.findById(req.params.id);
  if (!cause) {
    res.status(404);
    throw new Error("Cause not found");
  }
  const data = { ...req.body };
  if (req.file) {
    data.image = req.file.path;
    data.imagePublicId = req.file.filename;
  }
  Object.assign(cause, data);
  await cause.save();
  res.json({ success: true, cause });
});

export const deleteCause = asyncHandler(async (req, res) => {
  const cause = await Cause.findById(req.params.id);
  if (!cause) {
    res.status(404);
    throw new Error("Cause not found");
  }
  await cause.deleteOne();
  res.json({ success: true, message: "Cause deleted" });
});
