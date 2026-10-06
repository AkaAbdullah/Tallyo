"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { LogOut, Moon, Sun } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  async function signOut() {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left text-sm outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50">
        <span className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">
          {name.slice(0, 1).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{name}</span>
          <span className="block truncate text-xs text-muted-foreground">{email}</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">{email}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuItem onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
          {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={signOut}>
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
