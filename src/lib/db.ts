import "server-only";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const g = globalThis as typeof globalThis & {
  _tallyoClient?: MongoClient;
  _tallyoMongoose?: Promise<typeof mongoose>;
};

// Build steps import server modules without a database; the client only connects on first use.
const uri = () => process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/tallyo";

/** Shared native driver client (used by Better Auth). */
export function getMongoClient() {
  g._tallyoClient ??= new MongoClient(uri());
  return g._tallyoClient;
}

/** Mongoose connection for app models. Safe to call on every request. */
export async function connectDB() {
  g._tallyoMongoose ??= mongoose.connect(uri());
  return g._tallyoMongoose;
}
