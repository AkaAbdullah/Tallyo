import { Suspense } from "react";
import { enabledSocialProviders } from "@/lib/auth";
import { AuthForm } from "../auth-form";

export const metadata = {
  title: "Create a free account",
  description: "Sign up for Tallyo and send your first professional invoice in minutes. Free, with no card and no trial period.",
  alternates: { canonical: "/sign-up" },
};

export default function Page() {
  return (
    <Suspense>
      <AuthForm mode="sign-up" providers={enabledSocialProviders} />
    </Suspense>
  );
}
