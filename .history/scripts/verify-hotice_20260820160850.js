require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI tidak ditemukan");
    process.exit(1);
  }
  const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  try {
    await client.connect();
    const db = client.db("linktree");
    const p = db.collection("products");

    const samples = await p
      .find({ variant: { $exists: true } })
      .sort({ category: 1, order: 1 })
      .limit(12)
      .toArray();
    console.log("Sample varian HOT/ICE:");
    samples.forEach((s) => console.log(`  ${s.name} | ${s.code} | ${s.category}`));

    const byCat = {};
    const cats = await db.collection("categories").find({}).toArray();
    for (const cat of cats) {
      byCat[cat.name] = await p.countDocuments({ category: cat.name });
    }
    console.log("\nJumlah produk per kategori:");
    Object.entries(byCat).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
  } catch (err) {
    console.error("FAILED:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}


