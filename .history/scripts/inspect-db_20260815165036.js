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
    for (const c of collections) {
      const count = await db.collection(c.name).countDocuments();
      console.log(`\n[${c.name}] count=${count}`);
      const sample = await db.collection(c.name).findOne({});
      if (sample) console.log("  sample:", JSON.stringify(sample, null, 2).slice(0, 2000));
    }
  } catch (err) {
    console.error("FAILED:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();