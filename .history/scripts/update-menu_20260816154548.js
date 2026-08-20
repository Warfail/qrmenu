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

    // 3. Verifikasi
    const rokokCount = await products.countDocuments({ category: "Rokok" });
    const totalCount = await products.countDocuments({});
    console.log(`[3] Rokok: ${rokokCount}, Total produk sekarang: ${totalCount}`);
  } catch (err) {
    console.error("FAILED:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}


