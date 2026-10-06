import { MongoMemoryReplSet } from "mongodb-memory-server";

const g = globalThis as typeof globalThis & { _tallyoMemoryMongo?: Promise<MongoMemoryReplSet> };

/** Starts a single-node in-memory replica set (supports transactions, like Atlas). Data is lost on restart. */
export async function startMemoryMongo() {
  g._tallyoMemoryMongo ??= MongoMemoryReplSet.create({ replSet: { count: 1 } });
  const server = await g._tallyoMemoryMongo;
  console.log("\n  ⚠ Tallyo is using an in-memory MongoDB — data resets on restart. Set MONGODB_URI to keep it.\n");
  return server.getUri("tallyo");
}
