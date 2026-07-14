import asyncHandler from "express-async-handler";
import Event from "../models/Event.js";

// @desc    Get all published events (public)
// @route   GET /api/events
// @access  Public
export const getEvents = asyncHandler(async (req, res) => {
  const { category, upcoming } = req.query;
  const filter = { status: { $in: ["published", "registration_closed"] } };
  if (category) filter.category = category;
  if (upcoming === "true") filter.date = { $gte: new Date() };

  const events = await Event.find(filter).sort({ date: 1 });
  res.json({ success: true, count: events.length, events });
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  res.json({ success: true, event });
});

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Public (works for logged-in users or guests)
export const registerForEvent = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  if (event.status === "registration_closed" || event.status === "completed") {
    res.status(400);
    throw new Error("Registration is closed for this event");
  }
  if (event.registrationLimit > 0 && event.registeredUsers.length >= event.registrationLimit) {
    res.status(400);
    throw new Error("Event registration limit reached");
  }
  const alreadyRegistered = event.registeredUsers.some((r) => r.email === email);
  if (alreadyRegistered) {
    res.status(400);
    throw new Error("You have already registered for this event");
  }

  event.registeredUsers.push({ user: req.user?._id, name, email, phone });
  await event.save();

  res.json({ success: true, message: "Registered successfully for the event" });
});

// ---------------- Admin ----------------

// @desc    Get all events (admin - includes drafts)
// @route   GET /api/admin/events
// @access  Private (admin)
export const adminGetEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().sort({ date: -1 });
  res.json({ success: true, count: events.length, events });
});

// @desc    Create event
// @route   POST /api/admin/events
// @access  Private (admin)
export const createEvent = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.image = req.file.path;
    data.imagePublicId = req.file.filename;
  }
  const event = await Event.create(data);
  res.status(201).json({ success: true, event });
});

// @desc    Update event
// @route   PUT /api/admin/events/:id
// @access  Private (admin)
export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  const data = { ...req.body };
  if (req.file) {
    data.image = req.file.path;
    data.imagePublicId = req.file.filename;
  }
  Object.assign(event, data);
  await event.save();
  res.json({ success: true, event });
});

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
// @access  Private (admin)
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  await event.deleteOne();
  res.json({ success: true, message: "Event deleted" });
});

// @desc    Update event status (publish / close registration / cancel)
// @route   PATCH /api/admin/events/:id/status
// @access  Private (admin)
export const updateEventStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  event.status = status;
  await event.save();
  res.json({ success: true, event });
});
