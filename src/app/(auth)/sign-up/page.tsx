import { Suspense } from "react";
import { enabledSocialProviders } from "@/lib/auth";
import { AuthForm } from "../auth-form";

export const metadata = { title: "Create account" };

export default function Page() {
  return (
    <Suspense>
      <AuthForm mode="sign-up" providers={enabledSocialProviders} />
    </Suspense>
  );
}
