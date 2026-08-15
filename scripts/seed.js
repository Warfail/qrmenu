/* eslint-disable no-console */
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/linktree";

const DB_NAME = "linktree";

// Change this password before running in production!
const ADMIN_PASSWORD = "admin123";

async function seed() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    // Seed admin account with hashed password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const admins = db.collection("admins");
    await admins.updateOne(
      { _id: "main" },
      { $set: { password: hashedPassword } },
      { upsert: true }
    );
    console.log(`[seed] Admin account ready (password: ${ADMIN_PASSWORD})`);

    // Seed landing page with sample menu and settings
    const landing = db.collection("landing");
    const existing = await landing.findOne({ _id: "main" });

    if (!existing) {
      const landingDoc = {
        _id: "main",
        menu: [
          {
            title: "Website Kami",
            link: "https://example.com",
            type: "link",
            icon: "🌐",
            order: 0,
          },
          {
            title: "Instagram",
            link: "https://instagram.com",
            type: "link",
            icon: "📸",
            order: 1,
          },
          {
            title: "Menu Spesial",
            link: "https://example.com/menu",
            type: "popup",
            icon: "📋",
            order: 2,
          },
        ],
        settings: {
          title: "Bisnis Saya",
          description: "Selamat datang di link bisnis kami!",
          whatsappNumber: "6281234567890",
          googlePlaceId: "",
          avatar: "",
        },
        updatedAt: new Date(),
      };

      await landing.insertOne(landingDoc);
      console.log("[seed] Landing page initial data created.");
    } else {
      console.log("[seed] Landing page data already exists, skipping.");
    }

    console.log("[seed] Seeding complete.");
  } catch (error) {
    console.error("[seed] Error:", error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

seed();