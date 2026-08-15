import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so the connection
  // is preserved across hot-reloads (which would otherwise create
  // many new connections).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export const DB_NAME = "linktree";

export async function getLandingCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection("landing");
}

export async function getAdminsCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection("admins");
}

export async function getCategoriesCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection("categories");
}

export async function getProductsCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection("products");
}
