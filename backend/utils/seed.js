import "dotenv/config";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";
import Settings from "../models/Settings.js";
import Cause from "../models/Cause.js";

const run = async () => {
  await connectDB();

  const existingAdmin = await Admin.findOne();

  if (!existingAdmin) {
    await Admin.create({
      name: process.env.DEFAULT_ADMIN_NAME,
      email: process.env.DEFAULT_ADMIN_EMAIL,
      password: process.env.DEFAULT_ADMIN_PASSWORD,
      role: "superadmin",
    });

    console.log("Default admin created.");
  } else {
    console.log("Superadmin already exists, skipping.");
  }

  const existingSettings = await Settings.findOne();
  if (!existingSettings) {
    await Settings.create({
      heroTitle: "Together We Can Change Lives",
      heroSubtitle: "Join Sadhana Foundation in building a better tomorrow.",
      mission: "To empower underserved communities through education, health, and welfare programs.",
      vision: "A society where every individual has equal access to opportunity and dignity.",
      stats: {
        villagesServed: 25,
        volunteers: 120,
        peopleHelped: 3500,
        eventsOrganized: 50,
        fundsRaised: 1500000,
      },
      address: "Howrah, West Bengal, India",
      phone: "+91-00000-00000",
      email: "contact@sadhanafoundation.org",
    });
    console.log("Created default homepage settings.");
  }

  const causeCount = await Cause.countDocuments();
  if (causeCount === 0) {
    await Cause.insertMany([
      {
        title: "Child Education",
        slug: "child-education",
        description: "Providing books, uniforms, and school kits to underprivileged children.",
        goalAmount: 500000,
        raisedAmount: 180000,
      },
      {
        title: "Food Distribution",
        slug: "food-distribution",
        description: "Weekly meals for homeless and low-income families near Howrah.",
        goalAmount: 300000,
        raisedAmount: 120000,
      },
      {
        title: "Women Empowerment",
        slug: "women-empowerment",
        description: "Vocational training and micro-grants for women entrepreneurs.",
        goalAmount: 400000,
        raisedAmount: 90000,
      },
      {
        title: "Medical Camps",
        slug: "medical-camps",
        description: "Free health checkups and medicine distribution in rural areas.",
        goalAmount: 350000,
        raisedAmount: 210000,
      },
    ]);
    console.log("Created sample causes.");
  }

  console.log("Seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
