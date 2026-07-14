import asyncHandler from "express-async-handler";
import Testimonial from "../models/Testimonial.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Get approved testimonials (public)
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 });
  res.json({ success: true, count: testimonials.length, testimonials });
});

// @desc    Submit a testimonial (public - goes to pending approval)
// @route   POST /api/testimonials
// @access  Public
export const submitTestimonial = asyncHandler(async (req, res) => {
  const { name, review, rating } = req.body;
  const data = { name, review, rating, isApproved: false };
  if (req.file) {
    data.photo = req.file.path;
    data.photoPublicId = req.file.filename;
  }
  const testimonial = await Testimonial.create(data);
  res.status(201).json({
    success: true,
    testimonial,
    message: "Thank you! Your testimonial will be visible after admin approval.",
  });
});

// ---------------- Admin ----------------

// @desc    Get all testimonials (admin)
// @route   GET /api/admin/testimonials
// @access  Private (admin)
export const adminGetTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.json({ success: true, count: testimonials.length, testimonials });
});

// @desc    Create testimonial directly (admin)
// @route   POST /api/admin/testimonials
// @access  Private (admin)
export const adminCreateTestimonial = asyncHandler(async (req, res) => {
  const { name, review, rating } = req.body;
  const data = { name, review, rating, isApproved: true };
  if (req.file) {
    data.photo = req.file.path;
    data.photoPublicId = req.file.filename;
  }
  const testimonial = await Testimonial.create(data);
  res.status(201).json({ success: true, testimonial });
});

// @desc    Update testimonial (edit / approve)
// @route   PUT /api/admin/testimonials/:id
// @access  Private (admin)
export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }
  const data = { ...req.body };
  if (req.file) {
    data.photo = req.file.path;
    data.photoPublicId = req.file.filename;
  }
  Object.assign(testimonial, data);
  await testimonial.save();
  res.json({ success: true, testimonial });
});

// @desc    Delete testimonial
// @route   DELETE /api/admin/testimonials/:id
// @access  Private (admin)
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }
  if (testimonial.photoPublicId) {
    await cloudinary.uploader.destroy(testimonial.photoPublicId).catch(() => {});
  }
  await testimonial.deleteOne();
  res.json({ success: true, message: "Testimonial deleted" });
});
