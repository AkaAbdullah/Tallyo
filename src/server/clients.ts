"use server";

import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import { clientSchema } from "@/lib/schemas";
import { ClientModel } from "@/models/client";
import { requireWorkspace } from "@/server/session";
import type { FormState } from "@/server/business";

export async function saveClient(_prev: FormState, formData: FormData): Promise<FormState> {
  const { workspace } = await requireWorkspace();
  const id = String(formData.get("id") ?? "");
  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { error: "Some fields need attention.", fieldErrors };
  }

  if (id) {
    if (!isValidObjectId(id)) return { error: "This client no longer exists." };
    const res = await ClientModel.updateOne({ _id: id, organizationId: workspace.id }, { $set: parsed.data });
    if (!res.matchedCount) return { error: "This client no longer exists." };
  } else {
    await ClientModel.create({ ...parsed.data, organizationId: workspace.id });
  }
  redirect("/clients?saved=" + encodeURIComponent(parsed.data.name));
}

export async function deleteClient(id: string) {
  const { workspace } = await requireWorkspace();
  if (isValidObjectId(id)) await ClientModel.deleteOne({ _id: id, organizationId: workspace.id });
  redirect("/clients");
}
