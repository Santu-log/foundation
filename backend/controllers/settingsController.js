import asyncHandler from "express-async-handler";
import Settings from "../models/Settings.js";

// Ensures a single settings document always exists
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return settings;
};

// @desc    Get site-wide/homepage settings (public)
// @route   GET /api/settings
// @access  Public
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ success: true, settings });
});

// ---------------- Admin ----------------

// @desc    Update homepage/site settings (no coding required)
// @route   PUT /api/admin/settings
// @access  Private (admin)
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  const data = { ...req.body };

  // Parse nested JSON fields if sent as strings (e.g. from multipart/form-data)
  ["stats", "socialLinks", "teamMembers", "partners", "values"].forEach((key) => {
    if (typeof data[key] === "string") {
      try {
        data[key] = JSON.parse(data[key]);
      } catch {
        /* leave as-is */
      }
    }
  });

  if (req.file) {
    data.heroImage = req.file.path;
    data.heroImagePublicId = req.file.filename;
  }

  Object.assign(settings, data);
  await settings.save();
  res.json({ success: true, settings });
});
