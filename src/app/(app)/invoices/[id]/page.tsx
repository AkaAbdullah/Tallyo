import Link from "next/link";
import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";
import { FlashToast } from "@/components/app/flash-toast";
import { InvoiceDocument } from "@/components/invoice/invoice-document";
import { InvoicePaper } from "@/components/invoice/invoice-paper";
import { StatusBadge } from "@/components/invoice/status-badge";
import { computeTotals, formatDate, formatMoney } from "@/lib/money";
import { InvoiceModel } from "@/models/invoice";
import { businessDTO, invoiceDTO } from "@/server/dto";
import { displayStatus } from "@/server/invoice-queries";
import { requireWorkspace } from "@/server/session";
import { InvoiceToolbar, PaymentForm } from "./invoice-actions";

async function load(id: string) {
  if (!isValidObjectId(id)) return null;
  const { workspace, business } = await requireWorkspace();
  const invoice = await InvoiceModel.findOne({ _id: id, organizationId: workspace.id }).lean();
  return invoice ? { invoice, business } : null;
}

export async function generateMetadata({ params }: PageProps<"/invoices/[id]">) {
  const data = await load((await params).id);
  return { title: data?.invoice.number ?? "Invoice" };
}

export default async function InvoicePage({ params, searchParams }: PageProps<"/invoices/[id]">) {
  const { id } = await params;
  const { saved } = (await searchParams) as { saved?: string };
  const data = await load(id);
  if (!data) notFound();
  const inv = invoiceDTO(data.invoice);
  const status = displayStatus(data.invoice);
  const t = computeTotals(inv.items, inv, inv.amountPaid);

  const facts: [string, React.ReactNode][] = [
    ["Client", inv.clientId ? <Link href={`/clients/${inv.clientId}`} className="text-primary underline-offset-4 hover:underline">{inv.client.name}</Link> : inv.client.name],
    ["Invoice date", formatDate(inv.issueDate)],
    ["Due date", formatDate(inv.dueDate)],
    ["Total", formatMoney(t.total, inv.currency)],
    ["Paid", formatMoney(t.paid, inv.currency)],
  ];
  if (inv.paidAt) facts.push(["Paid on", formatDate(inv.paidAt)]);

  return (
    <>
      <FlashToast message={saved ? `${inv.number} saved` : undefined} />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/invoices" className="text-sm text-muted-foreground hover:text-foreground">Invoices</Link>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{inv.number}</h1>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{inv.client.name}{inv.project && `, ${inv.project}`}</p>
        </div>
        <InvoiceToolbar id={inv.id} number={inv.number} status={inv.status} balance={t.balance} currency={inv.currency} />
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <InvoicePaper>
          <InvoiceDocument business={businessDTO(data.business)} invoice={inv} />
        </InvoicePaper>
        <aside className="grid gap-6 lg:sticky lg:top-6">
          <div className="rounded-xl border border-rule p-5">
            <p className="text-sm text-muted-foreground">{status === "paid" ? "Paid in full" : "Balance due"}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{formatMoney(Math.max(t.balance, 0), inv.currency)}</p>
            {status === "overdue" && <p className="mt-1 text-sm text-[#8a5a00] dark:text-[#f3cf7a]">Was due {formatDate(inv.dueDate)}</p>}
            <dl className="mt-5 grid gap-2.5 border-t border-rule pt-4 text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          {inv.status !== "void" && inv.status !== "paid" && t.balance > 0 && (
            <div className="rounded-xl border border-rule p-5">
              <h2 className="mb-3 font-semibold">Record a payment</h2>
              <PaymentForm id={inv.id} number={inv.number} status={inv.status} balance={t.balance} currency={inv.currency} />
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
