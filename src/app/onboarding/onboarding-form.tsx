"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/native-select";
import { createWorkspace } from "@/server/workspaces";

type Option = { code: string; name: string };

// Lists come from the server so names match during hydration (ICU data differs between Node and browsers).
export function OnboardingForm({ firstName, countries, currencies }: { firstName: string; countries: Option[]; currencies: Option[] }) {
  const [state, action, pending] = useActionState(createWorkspace, undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Hi {firstName}, tell us about your business</CardTitle>
        <CardDescription>You can add your logo, tax numbers and bank details later in Settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Business name</Label>
            <Input id="name" name="name" placeholder="e.g. CodeAxis" required minLength={2} maxLength={80} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="country">Country</Label>
            <NativeSelect id="country" name="country" required defaultValue="">
              <option value="" disabled>Choose your country</option>
              {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </NativeSelect>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="currency">Main invoicing currency</Label>
            <NativeSelect id="currency" name="currency" defaultValue="USD">
              {currencies.map((c) => <option key={c.code} value={c.code}>{c.code} · {c.name}</option>)}
            </NativeSelect>
          </div>
          {state?.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" size="lg" disabled={pending}>{pending ? "Creating…" : "Create workspace"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
