import asyncHandler from "express-async-handler";
import Gallery from "../models/Gallery.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Get all gallery images (public)
// @route   GET /api/gallery
// @access  Public
export const getGallery = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const images = await Gallery.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: images.length, images });
});

// ---------------- Admin ----------------

// @desc    Upload single or multiple images
// @route   POST /api/admin/gallery
// @access  Private (admin)
export const uploadImages = asyncHandler(async (req, res) => {
  const { category, caption } = req.body;
  const files = req.files || (req.file ? [req.file] : []);

  if (!files.length) {
    res.status(400);
    throw new Error("No images uploaded");
  }

  const docs = await Gallery.insertMany(
    files.map((f) => ({
      imageUrl: f.path,
      imagePublicId: f.filename,
      category,
      caption: caption || "",
      uploadedBy: req.admin._id,
    }))
  );

  res.status(201).json({ success: true, images: docs });
});

// @desc    Update image (caption/category/featured)
// @route   PUT /api/admin/gallery/:id
// @access  Private (admin)
export const updateImage = asyncHandler(async (req, res) => {
  const image = await Gallery.findById(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error("Image not found");
  }
  Object.assign(image, req.body);
  await image.save();
  res.json({ success: true, image });
});

// @desc    Delete image
// @route   DELETE /api/admin/gallery/:id
// @access  Private (admin)
export const deleteImage = asyncHandler(async (req, res) => {
  const image = await Gallery.findById(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error("Image not found");
  }
  if (image.imagePublicId) {
    await cloudinary.uploader.destroy(image.imagePublicId).catch(() => {});
  }
  await image.deleteOne();
  res.json({ success: true, message: "Image deleted" });
});
