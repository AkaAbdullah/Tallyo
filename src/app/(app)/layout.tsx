import Link from "next/link";
import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/app/mobile-nav";
import { NavLinks } from "@/components/app/nav-links";
import { UserMenu } from "@/components/app/user-menu";
import { WorkspaceSwitcher } from "@/components/app/workspace-switcher";
import { requireWorkspace } from "@/server/session";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const { user, workspace, workspaces, business } = await requireWorkspace();
  const switcher = (
    <WorkspaceSwitcher
      current={{ id: workspace.id, name: business.name }}
      workspaces={workspaces.map((w) => ({ id: w.id, name: w.name }))}
      logo={business.logo || undefined}
    />
  );

  return (
    <div className="flex flex-1">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-5 border-r bg-muted/30 p-4 md:flex">
        <Link href="/dashboard" className="px-1"><Logo /></Link>
        {switcher}
        <NavLinks />
        <div className="mt-auto"><UserMenu name={user.name} email={user.email} /></div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b px-4 py-2 md:hidden">
          <Logo />
          <MobileNav>{switcher}</MobileNav>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
