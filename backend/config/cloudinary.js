import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generic storage factory - creates a multer storage instance for a given folder
const makeStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `sadhana-foundation/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1600, crop: "limit" }],
    },
  });

export const uploadGallery = multer({ storage: makeStorage("gallery") });
export const uploadEvent = multer({ storage: makeStorage("events") });
export const uploadBlog = multer({ storage: makeStorage("blogs") });
export const uploadTestimonial = multer({ storage: makeStorage("testimonials") });
export const uploadCause = multer({ storage: makeStorage("causes") });
export const uploadHomepage = multer({ storage: makeStorage("homepage") });
export const uploadAvatar = multer({ storage: makeStorage("avatars") });

export default cloudinary;
