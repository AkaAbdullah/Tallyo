import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/invoice/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate, formatMoney, todayISO } from "@/lib/money";
import { cn } from "@/lib/utils";
import { InvoiceModel } from "@/models/invoice";
import { displayStatus, invoiceStats } from "@/server/invoice-queries";
import { requireWorkspace } from "@/server/session";

export const metadata = { title: "Invoices" };

const FILTERS = [
  ["all", "All"], ["draft", "Drafts"], ["sent", "Unpaid"], ["overdue", "Overdue"], ["paid", "Paid"], ["void", "Void"],
] as const;
type Filter = (typeof FILTERS)[number][0];

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function Amounts({ list, empty }: { list: { currency: string; amount: number }[]; empty: string }) {
  if (!list.length) return <span>{empty}</span>;
  return (
    <span className="grid">
      {list.map((x) => <span key={x.currency}>{formatMoney(x.amount, x.currency)}</span>)}
    </span>
  );
}

export default async function InvoicesPage({ searchParams }: PageProps<"/invoices">) {
  const sp = (await searchParams) as { status?: string; q?: string };
  const filter: Filter = FILTERS.some(([k]) => k === sp.status) ? (sp.status as Filter) : "all";
  const q = (sp.q ?? "").trim().slice(0, 80);
  const { workspace } = await requireWorkspace();
  const today = todayISO();

  const query: Record<string, unknown> = { organizationId: workspace.id };
  if (filter === "overdue") Object.assign(query, { status: "sent", dueDate: { $lt: today } });
  else if (filter !== "all") query.status = filter;
  if (q) {
    const rx = { $regex: escapeRegex(q), $options: "i" };
    query.$or = [{ number: rx }, { "client.name": rx }, { project: rx }];
  }

  const [invoices, total, stats] = await Promise.all([
    InvoiceModel.find(query, { items: 0 }).sort({ issueDate: -1, number: -1 }).limit(300).lean(),
    InvoiceModel.countDocuments({ organizationId: workspace.id }),
    invoiceStats(workspace.id),
  ]);
  const href = (status: Filter) => `/invoices?${new URLSearchParams({ ...(status !== "all" && { status }), ...(q && { q }) })}`;

  if (total === 0) {
    return (
      <>
        <PageHeader title="Invoices" />
        <div className="rounded-xl border border-dashed border-rule px-6 py-16 text-center">
          <h2 className="text-lg font-semibold">Create your first invoice</h2>
          <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
            Pick a client, add what you did, and Tallyo lays out a proper invoice with your details and the right tax note.
          </p>
          <Link href="/invoices/new" className={buttonVariants({ size: "lg", className: "mt-6" })}>Create an invoice</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Invoices">
        <Link href="/invoices/new" className={buttonVariants({ size: "lg" })}>New invoice</Link>
      </PageHeader>

      <dl className="mb-8 grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-3">
        {[
          ["Waiting to be paid", <Amounts key="o" list={stats.outstanding} empty="Nothing outstanding" />],
          [`Overdue${stats.overdueCount ? ` (${stats.overdueCount})` : ""}`, <Amounts key="d" list={stats.overdue} empty="Nothing overdue" />],
          [`Paid in ${stats.year}`, <Amounts key="p" list={stats.paidThisYear} empty="No payments yet" />],
        ].map(([label, value]) => (
          <div key={String(label)} className="bg-background p-5">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-xl font-semibold tracking-tight">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <nav className="flex flex-wrap gap-1" aria-label="Filter invoices">
          {FILTERS.map(([key, label]) => (
            <Link
              key={key}
              href={href(key)}
              aria-current={filter === key ? "page" : undefined}
              className={cn("rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground", filter === key && "bg-accent font-medium text-carbon hover:bg-accent hover:text-carbon")}
            >
              {label}
            </Link>
          ))}
        </nav>
        <form className="relative w-full max-w-xs" role="search">
          {filter !== "all" && <input type="hidden" name="status" value={filter} />}
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Search number, client or project" aria-label="Search invoices" className="pl-8" />
        </form>
      </div>

      {invoices.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No invoices match. <Link href="/invoices" className="text-primary underline-offset-4 hover:underline">Show all invoices</Link>
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-rule">
          <table className="w-full text-sm">
            <thead className="border-b border-rule bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium">Invoice</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Client</th>
                <th scope="col" className="hidden px-4 py-2.5 font-medium md:table-cell">Date</th>
                <th scope="col" className="hidden px-4 py-2.5 font-medium sm:table-cell">Due</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Amount</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {invoices.map((inv) => {
                const status = displayStatus(inv, today);
                const balance = inv.total - inv.amountPaid;
                return (
                  <tr key={String(inv._id)} className="relative hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                      <Link href={`/invoices/${inv._id}`} className="after:absolute after:inset-0 focus-visible:outline-none">{inv.number}</Link>
                    </td>
                    <td className="px-4 py-3">
                      {inv.client?.name}
                      {inv.project && <p className="text-muted-foreground">{inv.project}</p>}
                    </td>
                    <td className="hidden px-4 py-3 whitespace-nowrap text-muted-foreground md:table-cell">{formatDate(inv.issueDate, "short")}</td>
                    <td className="hidden px-4 py-3 whitespace-nowrap text-muted-foreground sm:table-cell">{formatDate(inv.dueDate, "short")}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className="font-medium">{formatMoney(inv.total, inv.currency)}</span>
                      {status === "partial" && <p className="text-muted-foreground">{formatMoney(balance, inv.currency)} left</p>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
