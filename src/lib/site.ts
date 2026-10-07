import type { Metadata } from "next";

export const GITHUB_URL = "https://github.com/AkaAbdullah/Tallyo";

/**
 * Public address used for canonical URLs, the sitemap and share cards.
 * Set NEXT_PUBLIC_SITE_URL when you move to your own domain; otherwise the host's address is used.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.TALLYO_HOST_URL || "https://tallyo-dev.netlify.app").replace(/\/$/, "");
export const SITE_NAME = "Tallyo";
// Kept under ~155 characters so search results show it in full.
export const SITE_DESCRIPTION =
  "Free, open-source invoice software for freelancers. Create PDF invoices with your tax details, reverse-charge notes and bank info, and see who has paid.";

// When a page sets its own openGraph, Next.js stops inheriting the generated image, so it is listed explicitly.
const shareImage = { url: "/opengraph-image", width: 1200, height: 630, alt: "Tallyo: free, open-source invoice software for freelancers" };

/** Per-page metadata with a canonical URL and matching Open Graph and Twitter fields. */
export function pageMetadata({ title, description, path, absoluteTitle }: { title: string; description: string; path: string; absoluteTitle?: boolean }): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title: fullTitle, description, url: path, siteName: SITE_NAME, type: "website", locale: "en_US", images: [shareImage] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [shareImage.url] },
  };
}
