import { computeTotals, formatDate, formatMoney, lineAmount } from "@/lib/money";
import type { DocBusiness, DocInvoice } from "./types";

/** Everything a template prints, computed once so all templates show identical figures. */
export function prepare(b: DocBusiness, inv: DocInvoice) {
  const t = computeTotals(inv.items, inv, inv.amountPaid ?? 0);
  const cur = inv.currency;
  const money = (n: number) => formatMoney(n, cur);
  const brand = /^#[0-9a-f]{6}$/i.test(b.brandColor) ? b.brandColor : "#3341a6";
  const website = b.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const period = inv.serviceFrom
    ? `${formatDate(inv.serviceFrom)} – ${inv.serviceOngoing ? "ongoing" : formatDate(inv.serviceTo) || "…"}`
    : "";
  const paidInFull = t.total > 0 && t.balance <= 0;
  const items = inv.items.map((i) => ({
    ...i,
    bullets: i.bullets.map((x) => x.trim()).filter(Boolean),
    priceText: money(Number(i.price) || 0),
    amountText: money(lineAmount(i)),
    qtyText: String(Number(i.qty) || 0),
  }));
  const reference = inv.paymentReference || inv.number;

  return {
    b, inv, t, cur, money, brand, website, items,
    showQty: inv.items.some((i) => Number(i.qty) !== 1),
    number: inv.number || "Draft",
    issueDate: formatDate(inv.issueDate),
    dueDate: formatDate(inv.dueDate),
    terms: Number(inv.termsDays) ? `Due in ${inv.termsDays} days` : "Due on receipt",
    contact: [b.email, b.phone].filter(Boolean).join("  ·  "),
    owner: b.ownerName ? `${b.ownerName}${b.ownerTitle ? ` (${b.ownerTitle})` : ""}` : "",
    taxIds: b.taxIds.filter((r) => r.label || r.value),
    clientIds: inv.client.ids.filter((r) => r.label || r.value),
    bank: [...b.bankDetails.filter((r) => r.label || r.value), ...(reference ? [{ label: "Reference", value: reference }] : [])],
    strip: ([["Project", inv.project], ["Service period", period], ["Service type", inv.serviceType]] as const).filter(([, v]) => v),
    taxLine:
      inv.taxMode === "reverse_charge" ? `${inv.taxLabel || "VAT"} (0%, reverse charge)`
        : inv.taxMode === "rate" ? `${inv.taxLabel || "Tax"} (${t.rate}%)` : `${inv.taxLabel || "Tax"} (0%)`,
    dueLine: paidInFull ? `Paid in full${inv.paidAt ? ` on ${formatDate(inv.paidAt)}` : ""}` : inv.dueDate ? `Due by ${formatDate(inv.dueDate)}` : "",
    stamp: inv.status === "paid" ? ("PAID" as const) : inv.status === "void" ? ("VOID" as const) : null,
    hasNote: Boolean(inv.noteTitle || inv.noteBody),
  };
}

export type Prepared = ReturnType<typeof prepare>;
