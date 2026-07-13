import asyncHandler from "express-async-handler";
import crypto from "crypto";
import Razorpay from "razorpay";
import { Parser as Json2CsvParser } from "json2csv";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import Donation from "../models/Donation.js";
import Cause from "../models/Cause.js";
import { generateReceiptNumber } from "../utils/generateReceipt.js";
import { sendEmail } from "../utils/sendEmail.js";

// Instantiated lazily (not at module load) so env vars from dotenv are guaranteed to be set first
let razorpayInstance = null;
const getRazorpay = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

// @desc    Create a Razorpay order for a donation
// @route   POST /api/donations/create-order
// @access  Public
export const createDonationOrder = asyncHandler(async (req, res) => {
  const { name, email, phone, amount, causeId, isAnonymous } = req.body;

  if (!amount || amount < 1) {
    res.status(400);
    throw new Error("Invalid donation amount");
  }

  const order = await getRazorpay().orders.create({
    amount: Math.round(amount * 100), // paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  const donation = await Donation.create({
    donor: req.user?._id,
    name,
    email,
    phone,
    amount,
    cause: causeId || undefined,
    isAnonymous: !!isAnonymous,
    razorpayOrderId: order.id,
    paymentStatus: "pending",
  });

  res.status(201).json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    donationId: donation._id,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  });
});

// @desc    Verify payment after Razorpay checkout success
// @route   POST /api/donations/verify
// @access  Public
export const verifyDonationPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationId } = req.body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const donation = await Donation.findById(donationId);
  if (!donation) {
    res.status(404);
    throw new Error("Donation record not found");
  }

  if (generatedSignature !== razorpay_signature) {
    donation.paymentStatus = "failed";
    await donation.save();
    res.status(400);
    throw new Error("Payment verification failed");
  }

  donation.paymentStatus = "success";
  donation.razorpayPaymentId = razorpay_payment_id;
  donation.razorpaySignature = razorpay_signature;
  donation.receiptNumber = generateReceiptNumber();
  await donation.save();

  if (donation.cause) {
    await Cause.findByIdAndUpdate(donation.cause, { $inc: { raisedAmount: donation.amount } });
  }

  await sendEmail({
    to: donation.email,
    subject: "Thank you for your donation - Sadhana Foundation",
    html: `<p>Dear ${donation.name},</p><p>Thank you for your generous donation of ₹${donation.amount}.</p><p>Receipt No: ${donation.receiptNumber}</p><p>With gratitude,<br/>Sadhana Foundation</p>`,
  });

  res.json({ success: true, donation });
});

// @desc    Get a single donation receipt
// @route   GET /api/donations/:id/receipt
// @access  Public
export const getDonationReceipt = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id).populate("cause", "title");
  if (!donation || donation.paymentStatus !== "success") {
    res.status(404);
    throw new Error("Receipt not found");
  }
  res.json({ success: true, donation });
});

// ---------------- Admin ----------------

// @desc    Get all donations
// @route   GET /api/admin/donations
// @access  Private (admin)
export const adminGetDonations = asyncHandler(async (req, res) => {
  const { status, from, to } = req.query;
  const filter = {};
  if (status) filter.paymentStatus = status;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  const donations = await Donation.find(filter).populate("cause", "title").sort({ createdAt: -1 });
  res.json({ success: true, count: donations.length, donations });
});

// @desc    Export donations as CSV
// @route   GET /api/admin/donations/export/csv
// @access  Private (admin)
export const exportDonationsCsv = asyncHandler(async (req, res) => {
  const donations = await Donation.find().populate("cause", "title").sort({ createdAt: -1 });
  const rows = donations.map((d) => ({
    Name: d.name,
    Email: d.email,
    Amount: d.amount,
    Cause: d.cause?.title || "General Fund",
    PaymentStatus: d.paymentStatus,
    ReceiptNumber: d.receiptNumber || "",
    Date: d.createdAt.toISOString().split("T")[0],
  }));
  const parser = new Json2CsvParser();
  const csv = parser.parse(rows);
  res.header("Content-Type", "text/csv");
  res.attachment("donations.csv");
  res.send(csv);
});

// @desc    Export donations as Excel
// @route   GET /api/admin/donations/export/excel
// @access  Private (admin)
export const exportDonationsExcel = asyncHandler(async (req, res) => {
  const donations = await Donation.find().populate("cause", "title").sort({ createdAt: -1 });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Donations");
  sheet.columns = [
    { header: "Name", key: "name", width: 25 },
    { header: "Email", key: "email", width: 30 },
    { header: "Amount (INR)", key: "amount", width: 15 },
    { header: "Cause", key: "cause", width: 20 },
    { header: "Payment Status", key: "status", width: 15 },
    { header: "Receipt No", key: "receipt", width: 20 },
    { header: "Date", key: "date", width: 15 },
  ];
  donations.forEach((d) => {
    sheet.addRow({
      name: d.name,
      email: d.email,
      amount: d.amount,
      cause: d.cause?.title || "General Fund",
      status: d.paymentStatus,
      receipt: d.receiptNumber || "",
      date: d.createdAt.toISOString().split("T")[0],
    });
  });

  res.header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.attachment("donations.xlsx");
  await workbook.xlsx.write(res);
  res.end();
});

// @desc    Export donations as PDF
// @route   GET /api/admin/donations/export/pdf
// @access  Private (admin)
export const exportDonationsPdf = asyncHandler(async (req, res) => {
  const donations = await Donation.find().populate("cause", "title").sort({ createdAt: -1 });

  res.header("Content-Type", "application/pdf");
  res.attachment("donations.pdf");

  const doc = new PDFDocument({ margin: 30, size: "A4" });
  doc.pipe(res);

  doc.fontSize(16).text("Sadhana Foundation - Donation Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(10);

  donations.forEach((d) => {
    doc.text(
      `${d.name} | Rs.${d.amount} | ${d.cause?.title || "General Fund"} | ${d.paymentStatus} | ${
        d.receiptNumber || "-"
      } | ${d.createdAt.toISOString().split("T")[0]}`
    );
  });

  doc.end();
});
