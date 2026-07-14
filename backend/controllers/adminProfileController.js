import asyncHandler from "express-async-handler";
import Admin from "../models/Admin.js";

// @desc    Get logged-in admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin)
export const getProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select("-password");

  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  res.json({
    success: true,
    admin,
  });
});

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private (Admin)
export const updateProfile = asyncHandler(async (req, res) => {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim();

    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
        res.status(404);
        throw new Error("Admin not found");
    }

    if (name !== undefined && name.length === 0) {
        res.status(400);
        throw new Error("Name cannot be empty");
    }

    if (
        email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
        res.status(400);
        throw new Error("Invalid email");
    }

    if (email && email !== admin.email) {
        const existing = await Admin.findOne({ email });

        if (existing) {
            res.status(400);
            throw new Error("Email already in use");
        }
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;

    await admin.save();

    res.json({
        success: true,
        message: "Profile updated successfully",
        admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        },
    });
});

// @desc    Change admin password
// @route   PUT /api/admin/profile/password
// @access  Private (Admin)
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    res.status(400);
    throw new Error("All fields are required");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters long");
  }

  if (newPassword !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  const admin = await Admin.findById(req.admin._id).select("+password");

  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  const isMatch = await admin.matchPassword(currentPassword);

  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  admin.password = newPassword;

  // Password hashing should happen automatically in the model
  await admin.save();

  res.json({
    success: true,
    message: "Password updated successfully",
  });
});