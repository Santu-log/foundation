import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, default: "" },
    venue: { type: String, required: true },
    organizer: { type: String, default: "Sadhana Foundation" },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    category: {
      type: String,
      enum: [
        "Blood Donation",
        "Tree Plantation",
        "Health Camp",
        "Education",
        "Food Distribution",
        "Awareness",
        "Other",
      ],
      default: "Other",
    },
    registrationLimit: { type: Number, default: 0 }, // 0 = unlimited
    registeredUsers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        email: String,
        phone: String,
        registeredAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "registration_closed", "completed", "cancelled"],
      default: "draft",
    },
  },
  { timestamps: true }
);

eventSchema.virtual("registeredCount").get(function () {
  return this.registeredUsers.length;
});
eventSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Event", eventSchema);
