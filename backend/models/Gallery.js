import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, default: "" },
    caption: { type: String, default: "" },
    category: {
      type: String,
      enum: [
        "Education",
        "Food Distribution",
        "Medical Camps",
        "Plantation",
        "Volunteers",
        "Awareness Programs",
      ],
      required: true,
    },
    isFeatured: { type: Boolean, default: false },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
