import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional, guest donations allowed
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    amount: { type: Number, required: true, min: 1 },
    cause: { type: mongoose.Schema.Types.ObjectId, ref: "Cause" }, // optional - general fund if null
    paymentMethod: {
      type: String,
      enum: ["razorpay", "upi", "card", "netbanking", "offline"],
      default: "razorpay",
    },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    razorpaySignature: { type: String, default: "" },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },
    receiptNumber: { type: String, unique: true, sparse: true },
    isAnonymous: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);
