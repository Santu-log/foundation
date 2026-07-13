import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true }, // rich text HTML
    excerpt: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    coverImagePublicId: { type: String, default: "" },
    category: {
      type: String,
      enum: ["NGO Activities", "Event Updates", "Success Stories", "Awareness Articles"],
      default: "NGO Activities",
    },
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
