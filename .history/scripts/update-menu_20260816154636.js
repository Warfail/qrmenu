require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");
const fs = require("fs");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "linktree";
const MENU_JSON_PATH = "C:/Users/kiki/Music/menu.json";

async function main() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI tidak ditemukan di .env.local");
    process.exit(1);
  }

  const menu = JSON.parse(fs.readFileSync(MENU_JSON_PATH, "utf8"));
  console.log(`Menu items dari JSON: ${menu.length}`);

  const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const products = db.collection("products");

    // 1. Hapus semua produk yang category-nya BUKAN "Rokok"
    const deleteResult = await products.deleteMany({ category: { $ne: "Rokok" } });
    console.log(`[1] Dihapus produk non-Rokok: ${deleteResult.deletedCount}`);

    // 2. Insert semua data menu baru dari JSON
    const docs = menu.map((item, i) => ({
      category: item.category,
      name: item.name,
      price: Number(item.price) || 0,
      code: item.code || "",
      stock: Number(item.stock) || 0,
      order: i,
    }));

    if (docs.length > 0) {
      const insertResult = await products.insertMany(docs);
      console.log(`[2] Insert menu baru: ${insertResult.insertedCount}`);
    }

    // 4. Sinkronkan collection categories dengan kategori yang ada di JSON (+ Rokok)
    const categories = db.collection("categories");
    const newCats = [...new Set(menu.map((m) => m.category))];
    const validCats = [...new Set([...newCats, "Rokok"])];

    // Hapus kategori yang tidak punya produk lagi
    const oldCats = await categories.find({}).toArray();
    let removedCats = 0;
    for (const c of oldCats) {
      if (!validCats.includes(c.name)) {
        await categories.deleteOne({ _id: c._id });
        removedCats++;
      }
    }

    // Upsert kategori baru
    for (const name of validCats) {
      await categories.updateOne(
        { name },
        {
          $set: {
            name,
            updatedAt: new Date(),
          },
          $setOnInsert: { description: "", icon: "" },
        },
        { upsert: true }
      );
    }

    console.log(`[4] Kategori dihapus (tidak dipakai): ${removedCats}, Total kategori valid: ${validCats.length}`);

    // 5. Verifikasi
    const rokokCount = await products.countDocuments({ category: "Rokok" });
    const totalCount = await products.countDocuments({});
    console.log(`[5] Rokok: ${rokokCount}, Total produk sekarang: ${totalCount}`);
