import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

const getTokenFromReq = (req) => {
  if (req.headers.authorization?.startsWith("Bearer")) {
    return req.headers.authorization.split(" ")[1];
  }
  if (req.cookies?.token) return req.cookies.token;
  return null;
};

// Protect routes for logged-in users (donors/volunteers)
export const protectUser = asyncHandler(async (req, res, next) => {
  const token = getTokenFromReq(req);
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

// Protect routes for admin dashboard
export const protectAdmin = asyncHandler(async (req, res, next) => {
  const token = getTokenFromReq(req);
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id);
    if (!req.admin || !req.admin.isActive) {
      res.status(401);
      throw new Error("Admin not found or inactive");
    }
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

// Restrict to superadmin only
export const superAdminOnly = (req, res, next) => {
  if (req.admin?.role !== "superadmin") {
    res.status(403);
    throw new Error("Superadmin access only");
  }
  next();
};

// Attach req.user if a valid token is present, but never blocks the request
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = getTokenFromReq(req);
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch {
    // ignore invalid token for optional auth
  }
  next();
});
