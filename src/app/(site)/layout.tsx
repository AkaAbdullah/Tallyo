import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getSession } from "@/server/session";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const session = await getSession();
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader signedIn={Boolean(session)} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
