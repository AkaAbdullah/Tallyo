"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { BusinessModel } from "@/models/business";
import { requireUser } from "@/server/session";

const createSchema = z.object({
  name: z.string().trim().min(2, "Enter your business name").max(80),
  country: z.string().length(2, "Choose a country"),
  currency: z.string().length(3, "Choose a currency"),
});

export type CreateWorkspaceState = { error?: string } | undefined;

function slugify(text: string) {
  const base = text.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  return `${base || "workspace"}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Creates a workspace (Better Auth organization) plus its business profile, and makes it active. */
export async function createWorkspace(_prev: CreateWorkspaceState, formData: FormData): Promise<CreateWorkspaceState> {
  await requireUser();
  const parsed = createSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, country, currency } = parsed.data;

  const org = await auth.api.createOrganization({ body: { name, slug: slugify(name) }, headers: await headers() });
  if (!org) return { error: "Could not create the workspace. Please try again." };

  await connectDB();
  await BusinessModel.create({ organizationId: org.id, name, country, defaultCurrency: currency, footerText: name });
  redirect("/dashboard");
}
