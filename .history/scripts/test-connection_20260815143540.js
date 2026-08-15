require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

const NON_SRV_URI =
  "mongodb://rt45_db:8CuGRPbOkHIMdtS5@ac-ljljst2-shard-00-00.hr9anhk.mongodb.net:27017,ac-ljljst2-shard-00-01.hr9anhk.mongodb.net:27017,ac-ljljst2-shard-00-02.hr9anhk.mongodb.net:27017/linktree?replicaSet=atlas-1s6qnb-shard-0&authSource=admin&ssl=true";

async function tryConnect(label, uri) {
  console.log(`\n[${label}] Connecting...`);
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(`[${label}] SUCCESS: ping OK`);
    return true;
  } catch (err) {
    console.error(`[${label}] FAILED: ${err.message}`);
    return false;
  } finally {
    await client.close();
  }
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("SUCCESS: Connected to MongoDB, ping OK");
  } catch (err) {
    console.error("FAILED to connect:");
    console.error(err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();