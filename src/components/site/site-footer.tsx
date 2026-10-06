import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { GITHUB_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-muted/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto_auto]">
        <div className="max-w-xs">
          <LogoMark />
          <p className="mt-3 text-sm text-muted-foreground">
            Tallyo is free, open-source invoicing software released under the MIT license.
          </p>
        </div>
        <nav className="grid content-start gap-2 text-sm">
          <p className="font-medium">Product</p>
          <Link href="/features" className="text-muted-foreground hover:text-foreground">Features</Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link>
          <Link href="/sign-up" className="text-muted-foreground hover:text-foreground">Create an account</Link>
        </nav>
        <nav className="grid content-start gap-2 text-sm">
          <p className="font-medium">Open source</p>
          <Link href="/open-source" className="text-muted-foreground hover:text-foreground">Self-hosting guide</Link>
          <a href={GITHUB_URL} className="text-muted-foreground hover:text-foreground">Source code</a>
          <a href={`${GITHUB_URL}/issues`} className="text-muted-foreground hover:text-foreground">Report a bug</a>
        </nav>
      </div>
    </footer>
  );
}
