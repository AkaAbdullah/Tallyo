import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The in-memory MongoDB used in development spawns a native binary; keep it out of the bundle.
  serverExternalPackages: ["mongodb-memory-server", "mongodb-memory-server-core"],
  experimental: {
    // The build cache stores env values on disk; hosts like Netlify keep that cache between builds
    // and their secret scanners reject it. Builds start cold instead.
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
