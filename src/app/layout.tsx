import type { Metadata } from "next";
import { Geist_Mono, Schibsted_Grotesk } from "next/font/google";
import { cookies } from "next/headers";
import { THEME_COOKIE, parseTheme } from "@/lib/theme-cookie";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const sans = Schibsted_Grotesk({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Tallyo", template: "%s · Tallyo" },
  description: "Open-source invoicing for freelancers and small businesses, with AI that does the busywork.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${geistMono.variable} h-full antialiased ${theme === "system" ? "" : theme}`}>
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster richColors position="bottom-center" />
      </body>
    </html>
  );
}
