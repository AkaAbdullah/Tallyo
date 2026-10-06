import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { ClientModel } from "@/models/client";
import { requireWorkspace } from "@/server/session";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { user, workspace, business } = await requireWorkspace();
  const clientCount = await ClientModel.countDocuments({ organizationId: workspace.id });
  const steps = [
    { done: true, title: "Create your workspace", href: "/settings" },
    {
      done: Boolean(business.address && business.bankDetails.length),
      title: "Add your address, tax numbers and bank details",
      href: "/settings",
    },
    { done: clientCount > 0, title: "Add your first client", href: clientCount ? "/clients" : "/clients/new" },
    { done: false, title: "Create your first invoice", href: "/invoices" },
  ];

  return (
    <>
      <PageHeader title={`Welcome, ${user.name.split(" ")[0]}`} description={`Here's what's happening at ${business.name}.`} />
      <section className="rounded-xl border bg-card p-5">
        <h2 className="font-medium">Get set up</h2>
        <p className="text-sm text-muted-foreground">A few steps and you&apos;re ready to send your first invoice.</p>
        <ul className="mt-4 divide-y">
          {steps.map((s) => (
            <li key={s.title}>
              <Link href={s.href} className="group flex items-center gap-3 py-3 text-sm">
                {s.done ? <CheckCircle2 className="size-5 text-primary" /> : <Circle className="size-5 text-muted-foreground" />}
                <span className={s.done ? "flex-1 text-muted-foreground line-through" : "flex-1 font-medium"}>{s.title}</span>
                <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
