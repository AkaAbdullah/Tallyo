// Invoice arithmetic and formatting, shared by the editor, server actions, preview and PDF.

export type LineItem = { title: string; ref: string; bullets: string[]; qty: number; price: number };
export type TaxInput = { taxMode: "reverse_charge" | "none" | "rate"; taxRate: number };

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export const lineAmount = (item: Pick<LineItem, "qty" | "price">) => round2((Number(item.qty) || 0) * (Number(item.price) || 0));

export function computeTotals(items: Pick<LineItem, "qty" | "price">[], tax: TaxInput, amountPaid = 0) {
  const subtotal = round2(items.reduce((sum, i) => sum + lineAmount(i), 0));
  const rate = tax.taxMode === "rate" ? Number(tax.taxRate) || 0 : 0;
  const taxAmount = round2((subtotal * rate) / 100);
  const total = round2(subtotal + taxAmount);
  const paid = round2(Number(amountPaid) || 0);
  return { subtotal, rate, taxAmount, total, paid, balance: round2(total - paid) };
}

export function formatMoney(amount: number, currency: string, locale = "en-US") {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency, currencyDisplay: "narrowSymbol" }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/** "2026-10-06" → "06 October 2026". Dates are stored as plain calendar dates to avoid time-zone shifts. */
export function formatDate(iso: string | undefined | null, style: "long" | "short" = "long") {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: style === "long" ? "long" : "short", year: "numeric", timeZone: "UTC",
  }).format(Date.UTC(y, m - 1, d));
}

export function addDays(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + (Number(days) || 0)));
  return date.toISOString().slice(0, 10);
}

export const todayISO = () => new Date().toISOString().slice(0, 10);

export function formatInvoiceNumber(prefix: string, digits: number, n: number) {
  return `${prefix}${String(n).padStart(Math.min(Math.max(digits, 1), 12), "0")}`;
}
