import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The in-memory MongoDB used in development spawns a native binary; keep it out of the bundle.
  serverExternalPackages: ["mongodb-memory-server", "mongodb-memory-server-core"],
};

export default nextConfig;
