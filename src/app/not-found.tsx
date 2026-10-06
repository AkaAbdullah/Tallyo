import Link from "next/link";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <Logo />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">This page doesn&apos;t exist</h1>
        <p className="mt-2 text-muted-foreground">It may have been deleted, or the link is wrong.</p>
      </div>
      <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>Go to your dashboard</Link>
    </div>
  );
}
