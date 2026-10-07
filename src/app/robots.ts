import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Netlify sets CONTEXT to "deploy-preview" or "branch-deploy" for non-production builds; keep those out of search.
const isProduction = !process.env.CONTEXT || process.env.CONTEXT === "production";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard", "/invoices", "/clients", "/settings", "/onboarding", "/sign-in"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
