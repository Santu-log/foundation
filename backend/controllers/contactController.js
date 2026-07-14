import asyncHandler from "express-async-handler";
import ContactMessage from "../models/ContactMessage.js";
import { sendEmail } from "../utils/sendEmail.js";

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  const contactMessage = await ContactMessage.create({ name, email, phone, subject, message });

  res.status(201).json({
    success: true,
    message: "Your message has been received. We will get back to you soon.",
    contactMessage,
  });
});

// ---------------- Admin ----------------

// @desc    Get all contact messages
// @route   GET /api/admin/contact
// @access  Private (admin)
export const adminGetContactMessages = asyncHandler(async (req, res) => {
  const { isRead } = req.query;
  const filter = {};
  if (isRead !== undefined) filter.isRead = isRead === "true";
  const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: messages.length, messages });
});

// @desc    Get single message (marks as read)
// @route   GET /api/admin/contact/:id
// @access  Private (admin)
export const adminGetContactMessageById = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, message });
});

// @desc    Reply to a contact message
// @route   POST /api/admin/contact/:id/reply
// @access  Private (admin)
export const replyToContactMessage = asyncHandler(async (req, res) => {
  const { reply } = req.body;
  const message = await ContactMessage.findById(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  message.adminReply = reply;
  message.repliedAt = new Date();
  message.isRead = true;
  await message.save();

  await sendEmail({
    to: message.email,
    subject: "Re: Your message to Sadhana Foundation",
    html: `<p>Dear ${message.name},</p><p>${reply}</p><p>— Sadhana Foundation Team</p>`,
  });

  res.json({ success: true, message });
});

// @desc    Delete a contact message
// @route   DELETE /api/admin/contact/:id
// @access  Private (admin)
export const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  await message.deleteOne();
  res.json({ success: true, message: "Message deleted" });
});
