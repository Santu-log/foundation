import express from "express";
import {
  getBlogs,
  getBlogBySlug,
  adminGetBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { uploadBlog } from "../config/cloudinary.js";

const router = express.Router();

// Public
router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);

// Admin
router.get("/admin/all", protectAdmin, adminGetBlogs);
router.post("/admin", protectAdmin, uploadBlog.single("coverImage"), createBlog);
router.put("/admin/:id", protectAdmin, uploadBlog.single("coverImage"), updateBlog);
router.delete("/admin/:id", protectAdmin, deleteBlog);

export default router;
