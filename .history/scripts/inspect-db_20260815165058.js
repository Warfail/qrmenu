require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

const NON_SRV_URI =
  "mongodb://rt45_db:8CuGRPbOkHIMdtS5@ac-ljljst2-shard-00-00.hr9anhk.mongodb.net:27017,ac-ljljst2-shard-00-01.hr9anhk.mongodb.net:27017,ac-ljljst2-shard-00-02.hr9anhk.mongodb.net:27017/linktree?replicaSet=atlas-1s6qnb-shard-0&authSource=admin&ssl=true";

async function main() {
  const uri = process.env.MONGODB_URI || NON_SRV_URI;
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
  try {
    await client.connect();
    const db = client.db("linktree");
    const collections = await db.listCollections().toArray();
    console.log("Collections in 'linktree':");
    for (const c of collections) {
      console.log(`  - ${c.name}`);
    }
    const categories = await db.collection("categories").find({}).toArray();
    console.log("\nAll categories:");
    for (const cat of categories) {
      console.log(`  - ${cat.name} (icon: ${cat.icon})`);
    }

    for (const cat of categories) {
      const items = await db
        .collection("products")
        .find({ category: cat.name })
        .limit(3)
        .toArray();
      console.log(`\n[${cat.name}] sample products:`);
      for (const p of items) {
        console.log(
          `  - ${p.name} | code=${p.code} | price=${p.price} | stock=${p.stock}`
        );
      }
    }
  } catch (err) {
    console.error("FAILED:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();