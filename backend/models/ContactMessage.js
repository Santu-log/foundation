import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    adminReply: { type: String, default: "" },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("ContactMessage", contactMessageSchema);
