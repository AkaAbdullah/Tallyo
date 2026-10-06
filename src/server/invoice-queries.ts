import "server-only";
import { todayISO } from "@/lib/money";
import { InvoiceModel, type Invoice } from "@/models/invoice";

export type DisplayStatus = "draft" | "sent" | "overdue" | "partial" | "paid" | "void";

export function displayStatus(inv: Pick<Invoice, "status" | "dueDate" | "total" | "amountPaid">, today = todayISO()): DisplayStatus {
  if (inv.status === "sent") {
    if (inv.dueDate < today) return "overdue";
    if (inv.amountPaid > 0 && inv.amountPaid < inv.total) return "partial";
  }
  return inv.status as DisplayStatus;
}

/** Sums per currency, because invoices in different currencies can't be added together. */
function byCurrency(rows: { currency: string; amount: number }[]) {
  const map = new Map<string, number>();
  for (const r of rows) map.set(r.currency, Math.round(((map.get(r.currency) ?? 0) + r.amount) * 100) / 100);
  return [...map.entries()].map(([currency, amount]) => ({ currency, amount })).sort((a, b) => b.amount - a.amount);
}

export async function invoiceStats(organizationId: string) {
  const today = todayISO();
  const year = today.slice(0, 4);
  const rows = await InvoiceModel.find(
    { organizationId, status: { $in: ["sent", "paid"] } },
    { status: 1, currency: 1, total: 1, amountPaid: 1, dueDate: 1, paidAt: 1 },
  ).lean();
  const open = rows.filter((r) => r.status === "sent");
  return {
    outstanding: byCurrency(open.map((r) => ({ currency: r.currency, amount: r.total - r.amountPaid }))),
    overdue: byCurrency(open.filter((r) => r.dueDate < today).map((r) => ({ currency: r.currency, amount: r.total - r.amountPaid }))),
    overdueCount: open.filter((r) => r.dueDate < today).length,
    paidThisYear: byCurrency(rows.filter((r) => r.status === "paid" && r.paidAt.startsWith(year)).map((r) => ({ currency: r.currency, amount: r.total }))),
    year,
  };
}
