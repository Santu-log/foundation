import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    age: { type: Number, required: true },
    occupation: { type: String, default: "" },
    skills: [{ type: String }],
    availability: {
      type: String,
      enum: ["weekdays", "weekends", "evenings", "flexible"],
      default: "flexible",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },
    assignedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Volunteer", volunteerSchema);
