import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Public site addresses provided by hosts at build time, used when BETTER_AUTH_URL is not set.
  // Netlify: URL (main site) and DEPLOY_PRIME_URL (branch/preview). Vercel: VERCEL_PROJECT_PRODUCTION_URL.
  env: {
    TALLYO_HOST_URL:
      process.env.URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : ""),
    TALLYO_PREVIEW_URL: process.env.DEPLOY_PRIME_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""),
  },
  // The in-memory MongoDB used in development spawns a native binary; keep it out of the bundle.
  serverExternalPackages: ["mongodb-memory-server", "mongodb-memory-server-core"],
  experimental: {
    // The build cache stores env values on disk; hosts like Netlify keep that cache between builds
    // and their secret scanners reject it. Builds start cold instead.
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
