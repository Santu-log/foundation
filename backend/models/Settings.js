import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // Hero Banner
    heroTitle: { type: String, default: "Together We Can Change Lives" },
    heroSubtitle: {
      type: String,
      default: "Join Sadhana Foundation in building a better tomorrow.",
    },
    heroImage: { type: String, default: "" },
    heroImagePublicId: { type: String, default: "" },

    // About / Mission / Vision
    ngoIntro: { type: String, default: "" },
    history: { type: String, default: "" },
    mission: { type: String, default: "" },
    vision: { type: String, default: "" },
    values: [{ type: String }],
    founderMessage: { type: String, default: "" },
    teamMembers: [
      {
        name: String,
        role: String,
        photo: String,
        bio: String,
      },
    ],

    // Statistics
    stats: {
      villagesServed: { type: Number, default: 0 },
      volunteers: { type: Number, default: 0 },
      peopleHelped: { type: Number, default: 0 },
      eventsOrganized: { type: Number, default: 0 },
      fundsRaised: { type: Number, default: 0 }, // in INR
    },

    // Partners
    partners: [
      {
        name: String,
        logo: String,
      },
    ],

    // Footer / Contact / Social
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    mapEmbedUrl: { type: String, default: "" },
    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      youtube: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
