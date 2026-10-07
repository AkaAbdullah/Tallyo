"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

/** Signed-in state is checked in the browser so marketing pages stay static. */
export function AuthButtons() {
  const { data } = authClient.useSession();
  if (data?.user) return <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>Go to dashboard</Link>;
  return (
    <>
      <Link href="/sign-in" className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "hidden sm:inline-flex")}>Sign in</Link>
      <Link href="/sign-up" className={buttonVariants({ size: "lg" })}>Create an account</Link>
    </>
  );
}
