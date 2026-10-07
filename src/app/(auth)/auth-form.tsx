"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Provider = "github" | "google";

export function AuthForm({ mode, providers }: { mode: "sign-in" | "sign-up"; providers: Provider[] }) {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const destination = next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const isSignUp = mode === "sign-up";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    setPending(true);
    setError("");
    const { error } = isSignUp
      ? await authClient.signUp.email({ name: String(form.get("name")), email, password })
      : await authClient.signIn.email({ email, password });
    if (error) {
      setError(error.message || (error.status === 401 ? "Incorrect email or password." : "Something went wrong. Please try again."));
      setPending(false);
      return;
    }
    router.push(isSignUp ? "/onboarding" : destination);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl"><h1>{isSignUp ? "Create your free Tallyo account" : "Sign in to Tallyo"}</h1></CardTitle>
        <CardDescription>{isSignUp ? "Start invoicing in a couple of minutes." : "Sign in to your Tallyo account."}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {providers.length > 0 && (
          <div className="grid gap-2">
            {providers.map((p) => (
              <Button
                key={p}
                variant="outline"
                type="button"
                onClick={() => authClient.signIn.social({ provider: p, callbackURL: destination })}
              >
                Continue with {p === "github" ? "GitHub" : "Google"}
              </Button>
            ))}
            <p className="text-center text-xs text-muted-foreground">or with email</p>
          </div>
        )}
        <form onSubmit={onSubmit} className="grid gap-4">
          {isSignUp && (
            <div className="grid gap-1.5">
              <Label htmlFor="name">Your name</Label>
              <Input id="name" name="name" autoComplete="name" required />
            </div>
          )}
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={8}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              required
            />
            {isSignUp && <p className="text-xs text-muted-foreground">At least 8 characters.</p>}
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        {isSignUp ? "Already have an account?" : "New to Tallyo?"}&nbsp;
        <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="font-medium text-primary hover:underline">
          {isSignUp ? "Sign in" : "Create an account"}
        </Link>
      </CardFooter>
    </Card>
  );
}
