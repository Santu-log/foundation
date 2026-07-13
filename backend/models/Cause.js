import mongoose from "mongoose";

const causeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    goalAmount: { type: Number, default: 0 },
    raisedAmount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

causeSchema.virtual("progressPercent").get(function () {
  if (!this.goalAmount) return 0;
  return Math.min(100, Math.round((this.raisedAmount / this.goalAmount) * 100));
});
causeSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Cause", causeSchema);
