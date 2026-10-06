import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { dash } from "@better-auth/infra";
import { getMongoClient } from "@/lib/db";

const client = getMongoClient();

// Social sign-in is optional: a provider is enabled only when its credentials are set.
const socialProviders = {
  ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? { github: { clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET } }
    : {}),
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } }
    : {}),
};

export const enabledSocialProviders = Object.keys(socialProviders) as ("github" | "google")[];

export const auth = betterAuth({
  appName: "Tallyo",
  database: mongodbAdapter(client.db(), { client }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  socialProviders,
  // Each organization is a "workspace": one business with its own clients, invoices and team.
  plugins: [
    organization(),
    // Optional Better Auth dashboard (https://dash.better-auth.com). Enabled only when an API key is set.
    ...(process.env.BETTER_AUTH_API_KEY ? [dash({ apiKey: process.env.BETTER_AUTH_API_KEY })] : []),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
