import type { Metadata, Viewport } from "next";
import { Geist_Mono, Schibsted_Grotesk } from "next/font/google";
import { ThemeSync } from "@/components/theme";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const sans = Schibsted_Grotesk({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Free Invoice Software for Freelancers | Tallyo", template: "%s | Tallyo" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Syed Abdullah Hussain", url: "https://github.com/AkaAbdullah" }],
  creator: "Syed Abdullah Hussain",
  category: "business",
  keywords: ["invoice software", "free invoice generator", "invoicing for freelancers", "open source invoicing", "PDF invoice templates", "reverse charge invoice", "multi-currency invoices"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", url: "/", title: "Free Invoice Software for Freelancers | Tallyo", description: SITE_DESCRIPTION },
  twitter: { card: "summary_large_image", title: "Free Invoice Software for Freelancers | Tallyo", description: SITE_DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#17181d" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <ThemeSync />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
