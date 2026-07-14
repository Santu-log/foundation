import asyncHandler from "express-async-handler";
import Blog from "../models/Blog.js";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

// @desc    Get all published blogs (public)
// @route   GET /api/blogs
// @access  Public
export const getBlogs = asyncHandler(async (req, res) => {
  const { category, tag, search } = req.query;
  const filter = { status: "published" };
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (search) filter.title = { $regex: search, $options: "i" };

  const blogs = await Blog.find(filter).sort({ createdAt: -1 }).select("-content");
  res.json({ success: true, count: blogs.length, blogs });
});

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug, status: "published" },
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  res.json({ success: true, blog });
});

// ---------------- Admin ----------------

// @desc    Get all blogs (admin - includes drafts)
// @route   GET /api/admin/blogs
// @access  Private (admin)
export const adminGetBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json({ success: true, count: blogs.length, blogs });
});

// @desc    Create blog
// @route   POST /api/admin/blogs
// @access  Private (admin)
export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, excerpt, category, tags, status } = req.body;
  const slug = slugify(title) + "-" + Date.now().toString().slice(-5);

  const data = {
    title,
    slug,
    content,
    excerpt,
    category,
    tags: Array.isArray(tags) ? tags : String(tags || "").split(",").map((t) => t.trim()).filter(Boolean),
    status: status || "draft",
    author: req.admin._id,
  };
  if (req.file) {
    data.coverImage = req.file.path;
    data.coverImagePublicId = req.file.filename;
  }

  const blog = await Blog.create(data);
  res.status(201).json({ success: true, blog });
});

// @desc    Update blog
// @route   PUT /api/admin/blogs/:id
// @access  Private (admin)
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  const data = { ...req.body };
  if (data.tags && !Array.isArray(data.tags)) {
    data.tags = String(data.tags).split(",").map((t) => t.trim()).filter(Boolean);
  }
  if (req.file) {
    data.coverImage = req.file.path;
    data.coverImagePublicId = req.file.filename;
  }
  Object.assign(blog, data);
  await blog.save();
  res.json({ success: true, blog });
});

// @desc    Delete blog
// @route   DELETE /api/admin/blogs/:id
// @access  Private (admin)
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  await blog.deleteOne();
  res.json({ success: true, message: "Blog deleted" });
});
