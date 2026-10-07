import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/invoice/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { FlashToast } from "@/components/app/flash-toast";
import { formatDate, formatMoney, todayISO } from "@/lib/money";
import { ClientModel } from "@/models/client";
import { InvoiceModel } from "@/models/invoice";
import { displayStatus, invoiceStats } from "@/server/invoice-queries";
import { loadSampleData } from "@/server/demo";
import { requireWorkspace } from "@/server/session";

export const metadata = { title: "Dashboard" };

function Amounts({ list, empty }: { list: { currency: string; amount: number }[]; empty: string }) {
  if (!list.length) return <span className="text-muted-foreground">{empty}</span>;
  return <span className="grid">{list.map((x) => <span key={x.currency}>{formatMoney(x.amount, x.currency)}</span>)}</span>;
}

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const { sample } = (await searchParams) as { sample?: string };
  const { user, workspace, business } = await requireWorkspace();
  const [clientCount, invoiceCount, recent, stats] = await Promise.all([
    ClientModel.countDocuments({ organizationId: workspace.id }),
    InvoiceModel.countDocuments({ organizationId: workspace.id }),
    InvoiceModel.find({ organizationId: workspace.id }, { items: 0 }).sort({ updatedAt: -1 }).limit(6).lean(),
    invoiceStats(workspace.id),
  ]);
  const today = todayISO();
  const steps = [
    { done: Boolean(business.address && business.bankDetails.length), title: "Add your address, tax numbers and bank details", href: "/settings" },
    { done: clientCount > 0, title: "Add your first client", href: "/clients/new" },
    { done: invoiceCount > 0, title: "Create your first invoice", href: "/invoices/new" },
  ];
  const setupDone = steps.every((s) => s.done);

  return (
    <>
      <PageHeader title={`Welcome, ${user.name.split(" ")[0]}`} description={business.name}>
        <Link href="/invoices/new" className={buttonVariants({ size: "lg" })}>New invoice</Link>
      </PageHeader>

      <FlashToast message={sample ? "Sample clients and invoices added. Delete them whenever you like." : undefined} />
      {invoiceCount === 0 && (
        <section className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dashed border-rule p-5">
          <div>
            <h2 className="font-semibold">Just looking around?</h2>
            <p className="text-sm text-muted-foreground">Add three sample clients and four invoices to see how everything fits together.</p>
          </div>
          <form action={loadSampleData}>
            <Button type="submit" variant="outline" size="lg">Add sample data</Button>
          </form>
        </section>
      )}

      {!setupDone && (
        <section className="mb-8 rounded-xl border border-rule p-5">
          <h2 className="font-semibold">Finish setting up</h2>
          <ul className="mt-3 divide-y divide-rule">
            {steps.map((s) => (
              <li key={s.title}>
                <Link href={s.href} className="flex items-center gap-3 py-3 text-sm hover:text-primary">
                  {s.done ? <CheckCircle2 className="size-5 text-primary" /> : <Circle className="size-5 text-muted-foreground" />}
                  <span className={s.done ? "text-muted-foreground line-through" : "font-medium"}>{s.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {invoiceCount > 0 && (
        <>
          <dl className="mb-8 grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-3">
            <div className="bg-background p-5">
              <dt className="text-sm text-muted-foreground">Waiting to be paid</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight"><Amounts list={stats.outstanding} empty="Nothing outstanding" /></dd>
            </div>
            <div className="bg-background p-5">
              <dt className="text-sm text-muted-foreground">Overdue</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight"><Amounts list={stats.overdue} empty="Nothing overdue" /></dd>
              {stats.overdueCount > 0 && (
                <Link href="/invoices?status=overdue" className="mt-1 inline-block text-sm text-primary underline-offset-4 hover:underline">
                  See {stats.overdueCount} overdue {stats.overdueCount === 1 ? "invoice" : "invoices"}
                </Link>
              )}
            </div>
            <div className="bg-background p-5">
              <dt className="text-sm text-muted-foreground">Paid in {stats.year}</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight"><Amounts list={stats.paidThisYear} empty="No payments yet" /></dd>
            </div>
          </dl>

          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-semibold">Recent invoices</h2>
              <Link href="/invoices" className="text-sm text-primary underline-offset-4 hover:underline">All invoices</Link>
            </div>
            <ul className="divide-y divide-rule rounded-xl border border-rule">
              {recent.map((inv) => (
                <li key={String(inv._id)}>
                  <Link href={`/invoices/${inv._id}`} className="flex items-center gap-4 px-4 py-3 text-sm hover:bg-muted/40">
                    <span className="w-28 shrink-0 font-medium">{inv.number}</span>
                    <span className="min-w-0 flex-1 truncate">{inv.client?.name}</span>
                    <span className="hidden text-muted-foreground sm:inline">{formatDate(inv.issueDate, "short")}</span>
                    <span className="w-28 text-right font-medium">{formatMoney(inv.total, inv.currency)}</span>
                    <StatusBadge status={displayStatus(inv, today)} className="w-20 justify-center" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  );
}
