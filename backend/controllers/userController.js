import asyncHandler from "express-async-handler";
import Donation from "../models/Donation.js";
import Volunteer from "../models/Volunteer.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

// @desc    Get logged-in user's dashboard data
// @route   GET /api/users/dashboard
// @access  Private (user)
export const getUserDashboard = asyncHandler(async (req, res) => {
  const [donations, volunteer, registeredEvents] = await Promise.all([
    Donation.find({ donor: req.user._id, paymentStatus: "success" }).sort({ createdAt: -1 }),
    Volunteer.findOne({ user: req.user._id }),
    Event.find({ "registeredUsers.user": req.user._id }).select(
      "name date venue status registeredUsers"
    ),
  ]);

  res.json({
    success: true,
    donations,
    volunteer,
    registeredEvents: registeredEvents.map((e) => ({
      _id: e._id,
      name: e.name,
      date: e.date,
      venue: e.venue,
      status: e.status,
    })),
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (user)
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, phone } = req.body;
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (req.file) user.avatar = req.file.path;
  await user.save();
  res.json({ success: true, user });
});
