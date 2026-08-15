require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

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