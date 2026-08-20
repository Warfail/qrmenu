require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");
const fs = require("fs");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "linktree";
const MENU_JSON_PATH = "C:/Users/kiki/Music/menu.json";

// Aturan varian HOT/ICE per kategori & nama item
const VARIANT_RULES = {
  "CAFFEINE INJECTORS": {
    "Espresso Shot": ["HOT"],
    "Americano": ["HOT", "ICE"],
    "Kopi Tubruk": ["HOT"],
    "Cappuccino": ["HOT", "ICE"],
    "Mochacino": ["HOT", "ICE"],
    Affogato: null,
    "Vietnam Drip": ["HOT"],
    "V-60": ["HOT"],
    "Japanese Ice Drip": ["ICE"],
  },
  "CLUTCH PERFORMANCE": {
    "Coffee Latte": ["HOT", "ICE"],
    "Seasalt Caramel Latte": ["HOT", "ICE"],
    "Seasalt Butterscotch Latte": ["HOT", "ICE"],
    "Seasalt Pistachio Latte": ["ICE"],
    "Pistachio Gula Aren Latte": ["HOT", "ICE"],
    "Hazelnut Latte": ["HOT", "ICE"],
    "Vanilla Latte": ["HOT", "ICE"],
    "Gula Aren Latte": ["HOT", "ICE"],
    "Caramel Latte": ["HOT", "ICE"],
    "Butterscotch Latte": ["HOT", "ICE"],
  },
  "ENDURANCE LAB & HYPERDRIVE": {
    "Milo Godzilla": ["ICE"],
    "Milo Dinosaurus": ["ICE"],
    "Milo Shake": ["ICE"],
    "Milo": ["HOT", "ICE"],
    "Neslo": ["ICE"],
    "Susu Matcha": ["HOT", "ICE"],
    "Susu Taro": ["HOT", "ICE"],
    "Susu Red Velvet": ["HOT", "ICE"],
    "Susu Coklat": ["HOT", "ICE"],
    "Milkshake Vanilla": ["ICE"],
    "Milkshake Choco": ["ICE"],
    "Milkshake Strawberry": ["ICE"],
    "Milkshake Taro": ["ICE"],
    "Milkshake Matcha": ["ICE"],
  },
  "FLUID HYDRATION & REFRESHER": {
    "Virgin Mojito": ["ICE"],
    "Lychee Mojito": ["ICE"],
    "Strawberry Mojito": ["ICE"],
    "Jus Melon": ["ICE"],
    "Jus Strawberry": ["ICE"],
    "Jus Orange": ["ICE"],
    "Jus Naga": ["ICE"],
    "Jus Jambu": ["ICE"],
    "Jus Nanas": ["ICE"],
    "Jus Avocado": ["ICE"],
    "Jus Tape": ["ICE"],
    "Teh Tawar": ["HOT", "ICE"],
    "Teh Manis": ["HOT", "ICE"],
    "Lemon Tea": ["HOT", "ICE"],
    "Lychee Tea": ["HOT", "ICE"],
    "Air Jeruk": ["HOT", "ICE"],
    "Mineral Water": ["ICE"],
    "Coca-Cola": ["ICE"],
    "Fanta": ["ICE"],
    "Sprite": ["ICE"],
  },
  "POST-MATCH HEALING": {
    "Wedang Uwuh": ["HOT"],
    "Wedang Jahe": ["HOT"],
    "Susu Jahe": ["HOT"],
    "Rooftop Ice Cream": null,
  },
};

function buildDocs(menu) {
  const docs = [];
  let order = 0;

  for (const item of menu) {
    const { category, name, price, code, stock } = item;
    const rules = VARIANT_RULES[category];
    const variants = rules ? rules[name] : undefined;

    // Tidak ada aturan → tetap satu item
    if (variants === undefined || variants === null) {
      docs.push({
        category,
        name,
        price: Number(price) || 0,
        code: code || "",
        stock: Number(stock) || 0,
        order: order++,
      });
      continue;
    }

    // Ada aturan varian → expand
    for (const v of variants) {
      const suffix = v === "HOT" ? "Hot" : "Ice";
      docs.push({
        category,
        name: `${name} ${suffix}`,
        price: Number(price) || 0,
        code: `${code}-${v}`,
        stock: Number(stock) || 0,
        variant: v,
        order: order++,
      });
    }
  }
  return docs;
}

async function main() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI tidak ditemukan di .env.local");
    process.exit(1);
  }

  const menu = JSON.parse(fs.readFileSync(MENU_JSON_PATH, "utf8"));
  const docs = buildDocs(menu);
  console.log(`Menu JSON: ${menu.length} item → setelah varian: ${docs.length} item`);

  const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const products = db.collection("products");

    // 1. Hapus semua produk non-Rokok
    const del = await products.deleteMany({ category: { $ne: "Rokok" } });
    console.log(`[1] Hapus produk non-Rokok: ${del.deletedCount}`);

    // 2. Insert menu baru (+ varian HOT/ICE)
    const ins = await products.insertMany(docs);
    console.log(`[2] Insert produk baru: ${ins.insertedCount}`);

    // 3. Verifikasi
    const rokok = await products.countDocuments({ category: "Rokok" });
    const total = await products.countDocuments({});
    const hot = await products.countDocuments({ variant: "HOT" });
    const ice = await products.countDocuments({ variant: "ICE" });
    console.log(`[3] Rokok: ${rokok}, Total: ${total}, HOT: ${hot}, ICE: ${ice}`);
  } catch (err) {
    console.error("FAILED:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();