import asyncHandler from "express-async-handler";
import Donation from "../models/Donation.js";
import Event from "../models/Event.js";
import Volunteer from "../models/Volunteer.js";
import Gallery from "../models/Gallery.js";
import Blog from "../models/Blog.js";
import User from "../models/User.js";

// @desc    Dashboard overview cards
// @route   GET /api/admin/dashboard/overview
// @access  Private (admin)
export const getDashboardOverview = asyncHandler(async (req, res) => {
  const [totalDonationsAgg, totalEvents, totalVolunteers, galleryImages, blogPosts, registeredUsers] =
    await Promise.all([
      Donation.aggregate([
        { $match: { paymentStatus: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      Event.countDocuments(),
      Volunteer.countDocuments(),
      Gallery.countDocuments(),
      Blog.countDocuments(),
      User.countDocuments(),
    ]);

  res.json({
    success: true,
    overview: {
      totalDonations: totalDonationsAgg[0]?.total || 0,
      totalDonationCount: totalDonationsAgg[0]?.count || 0,
      totalEvents,
      totalVolunteers,
      galleryImages,
      blogPosts,
      registeredUsers,
    },
  });
});

// @desc    Monthly donations chart data (last 12 months)
// @route   GET /api/admin/dashboard/charts/donations
// @access  Private (admin)
export const getMonthlyDonationsChart = asyncHandler(async (req, res) => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);

  const data = await Donation.aggregate([
    { $match: { paymentStatus: "success", createdAt: { $gte: twelveMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.json({ success: true, data });
});

// @desc    Volunteer growth chart data (last 12 months, cumulative)
// @route   GET /api/admin/dashboard/charts/volunteers
// @access  Private (admin)
export const getVolunteerGrowthChart = asyncHandler(async (req, res) => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);

  const data = await Volunteer.aggregate([
    { $match: { createdAt: { $gte: twelveMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.json({ success: true, data });
});

// @desc    Event participation chart data
// @route   GET /api/admin/dashboard/charts/events
// @access  Private (admin)
export const getEventParticipationChart = asyncHandler(async (req, res) => {
  const events = await Event.find().sort({ date: -1 }).limit(12);
  const data = events.map((e) => ({
    event: e.name,
    date: e.date,
    registered: e.registeredUsers.length,
    limit: e.registrationLimit,
  }));
  res.json({ success: true, data });
});
