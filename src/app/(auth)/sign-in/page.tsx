import { Suspense } from "react";
import { enabledSocialProviders } from "@/lib/auth";
import { AuthForm } from "../auth-form";

export const metadata = { title: "Sign in", robots: { index: false, follow: true }, alternates: { canonical: "/sign-in" } };

export default function Page() {
  return (
    <Suspense>
      <AuthForm mode="sign-in" providers={enabledSocialProviders} />
    </Suspense>
  );
}
