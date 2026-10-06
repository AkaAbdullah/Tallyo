import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { BusinessModel } from "@/models/business";

export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session;
}

/**
 * Resolves the signed-in user's current workspace and its business profile.
 * Falls back to the user's first workspace when none is active, and sends users without one to onboarding.
 */
export const requireWorkspace = cache(async () => {
  const session = await requireUser();
  const workspaces = await auth.api.listOrganizations({ headers: await headers() });
  if (!workspaces.length) redirect("/onboarding");

  const workspace = workspaces.find((w) => w.id === session.session.activeOrganizationId) ?? workspaces[0];
  await connectDB();
  const business = await BusinessModel.findOne({ organizationId: workspace.id }).lean();
  if (!business) redirect("/onboarding");

  return { session, user: session.user, workspace, workspaces, business };
});
