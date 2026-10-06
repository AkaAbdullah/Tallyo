import Link from "next/link";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const links = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/open-source", label: "Self-hosting" },
];

export function SiteHeader({ signedIn }: { signedIn: boolean }) {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4 sm:px-6">
        <Link href="/" aria-label="Tallyo home"><Logo /></Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">{l.label}</Link>
          ))}
          <a href={GITHUB_URL} className="transition-colors hover:text-foreground">GitHub</a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {signedIn ? (
            <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>Go to dashboard</Link>
          ) : (
            <>
              <Link href="/sign-in" className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "hidden sm:inline-flex")}>Sign in</Link>
              <Link href="/sign-up" className={buttonVariants({ size: "lg" })}>Create an account</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
