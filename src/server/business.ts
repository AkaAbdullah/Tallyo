"use server";

import { headers } from "next/headers";
import { refresh } from "next/cache";
import { auth } from "@/lib/auth";
import { businessSchema } from "@/lib/schemas";
import { BusinessModel } from "@/models/business";
import { requireWorkspaceAdmin } from "@/server/session";

export type FormState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> } | undefined;

export async function updateBusiness(_prev: FormState, formData: FormData): Promise<FormState> {
  let ctx;
  try {
    ctx = await requireWorkspaceAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }
  const parsed = businessSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { error: "Some fields need attention.", fieldErrors };
  }

  await BusinessModel.updateOne({ organizationId: ctx.workspace.id }, { $set: parsed.data });
  if (parsed.data.name !== ctx.workspace.name) {
    await auth.api.updateOrganization({
      body: { organizationId: ctx.workspace.id, data: { name: parsed.data.name } },
      headers: await headers(),
    });
  }
  refresh();
  return { ok: true };
}
