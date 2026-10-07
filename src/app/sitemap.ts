import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/features", priority: 0.9, changeFrequency: "monthly" },
  { path: "/invoice-templates", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/open-source", priority: 0.7, changeFrequency: "monthly" },
  { path: "/sign-up", priority: 0.6, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.map((p) => ({ url: `${SITE_URL}${p.path === "/" ? "" : p.path}`, lastModified, changeFrequency: p.changeFrequency, priority: p.priority }));
}
