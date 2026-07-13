import asyncHandler from "express-async-handler";
import Admin from "../models/Admin.js";
import { generateToken, sendTokenCookie } from "../utils/generateToken.js";

// @desc    Admin login
// @route   POST /api/admin/auth/login
// @access  Public
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin || !admin.isActive || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = generateToken(admin._id);
  sendTokenCookie(res, token);

  res.json({
    success: true,
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
});

// @desc    Get current admin
// @route   GET /api/admin/auth/me
// @access  Private (admin)
export const getAdminMe = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// @desc    Admin logout
// @route   POST /api/admin/auth/logout
// @access  Private (admin)
export const logoutAdmin = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
});

// @desc    Create a new admin (superadmin only)
// @route   POST /api/admin/auth/create
// @access  Private (superadmin)
export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await Admin.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("Admin already exists with this email");
  }

  const admin = await Admin.create({ name, email, password, role: role || "admin" });
  res.status(201).json({
    success: true,
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
});
