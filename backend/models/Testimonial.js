import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    photo: { type: String, default: "" },
    photoPublicId: { type: String, default: "" },
    review: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
