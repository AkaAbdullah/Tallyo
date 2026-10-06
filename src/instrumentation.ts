// Runs once before the server handles requests.
// With no MONGODB_URI in development, start a throwaway in-memory MongoDB so `pnpm dev` works out of the box.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.MONGODB_URI) return;
  if (process.env.NODE_ENV === "production") {
    throw new Error("MONGODB_URI is not set. Add it to your environment (see .env.example).");
  }
  const { startMemoryMongo } = await import("./lib/dev-mongo");
  process.env.MONGODB_URI = await startMemoryMongo();
}
