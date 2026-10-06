"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Workspace = { id: string; name: string };

function Initial({ name, logo }: { name: string; logo?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- user-uploaded data URL
  if (logo) return <img src={logo} alt="" className="size-7 rounded-md border bg-white object-contain" />;
  return (
    <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export function WorkspaceSwitcher({ current, workspaces, logo }: { current: Workspace; workspaces: Workspace[]; logo?: string }) {
  const router = useRouter();

  async function select(id: string) {
    if (id === current.id) return;
    const { error } = await authClient.organization.setActive({ organizationId: id });
    if (error) return toast.error(error.message ?? "Could not switch workspace");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-lg border bg-card p-2 text-left text-sm outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50">
        <Initial name={current.name} logo={logo} />
        <span className="flex-1 truncate font-medium">{current.name}</span>
        <ChevronsUpDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          {workspaces.map((w) => (
            <DropdownMenuItem key={w.id} onClick={() => select(w.id)}>
              <span className="flex-1 truncate">{w.name}</span>
              {w.id === current.id && <Check className="size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/onboarding" />}>
          <Plus className="size-4" /> New workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
