import { computeTotals, formatDate, formatMoney, lineAmount, type LineItem } from "@/lib/money";

type Row = { label: string; value: string };

export type DocBusiness = {
  name: string; legalForm: string; ownerName: string; ownerTitle: string; address: string; email: string; phone: string;
  website: string; logo: string; brandColor: string; taxIds: Row[]; bankDetails: Row[]; footerText: string;
};

export type DocInvoice = {
  number: string; status?: string; issueDate: string; termsDays: number; dueDate: string; currency: string;
  client: { name: string; address: string; ids: Row[] };
  project: string; serviceType: string; serviceFrom: string; serviceTo: string; serviceOngoing: boolean;
  items: LineItem[]; taxMode: "reverse_charge" | "none" | "rate"; taxRate: number; taxLabel: string;
  noteTitle: string; noteBody: string; notes: string; paymentReference: string; amountPaid?: number; paidAt?: string;
};

const ink = "#1e2026";
const muted = "#6b7079";

function KeyValues({ rows, labelWidth }: { rows: Row[]; labelWidth?: number }) {
  const visible = rows.filter((r) => r.label || r.value);
  if (!visible.length) return null;
  return (
    <div className="mt-1.5 grid gap-x-2 gap-y-0.5" style={{ gridTemplateColumns: labelWidth ? `${labelWidth}px 1fr` : "auto 1fr" }}>
      {visible.map((r, i) => (
        <div key={i} className="contents">
          <span style={{ color: muted }}>{r.label}</span>
          <span className="font-medium">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-1 text-[9px] font-semibold tracking-[0.06em]" style={{ color: muted }}>{children}</p>;
}

/** The invoice as printed: an A4 page at 794px wide. Paper colours stay fixed in dark mode. */
export function InvoiceDocument({ business: b, invoice: inv }: { business: DocBusiness; invoice: DocInvoice }) {
  const t = computeTotals(inv.items, inv, inv.amountPaid ?? 0);
  const cur = inv.currency;
  const showQty = inv.items.some((i) => Number(i.qty) !== 1);
  const brand = /^#[0-9a-f]{6}$/i.test(b.brandColor) ? b.brandColor : "#3341a6";
  const website = b.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const period = inv.serviceFrom
    ? `${formatDate(inv.serviceFrom)} – ${inv.serviceOngoing ? "ongoing" : formatDate(inv.serviceTo) || "…"}`
    : "";
  const strip = [["Project", inv.project], ["Service period", period], ["Service type", inv.serviceType]].filter(([, v]) => v);
  const taxLine =
    inv.taxMode === "reverse_charge" ? `${inv.taxLabel || "VAT"} (0%, reverse charge)`
      : inv.taxMode === "rate" ? `${inv.taxLabel || "Tax"} (${t.rate}%)` : `${inv.taxLabel || "Tax"} (0%)`;
  const paidInFull = t.total > 0 && t.balance <= 0;
  const bank = [...b.bankDetails, ...(inv.paymentReference || inv.number ? [{ label: "Reference", value: inv.paymentReference || inv.number }] : [])];

  return (
    <div className="flex min-h-[1123px] w-[794px] flex-col bg-white px-[57px] pt-[42px] pb-[30px] text-[10.5px] leading-[1.45]" style={{ color: ink }}>
      <header className="flex items-start justify-between">
        <div>
          {b.logo && (
            // eslint-disable-next-line @next/next/no-img-element -- data URL logo
            <img src={b.logo} alt="" className="mb-2.5 h-10 w-auto max-w-[180px] object-contain object-left" />
          )}
          <p className="text-[15px] font-bold">{b.name || "Your business"}</p>
          {b.legalForm && <p className="mb-1 text-[10px]" style={{ color: muted }}>({b.legalForm})</p>}
          <p style={{ color: muted }}>{[b.email, b.phone].filter(Boolean).join(" · ")}</p>
          {website && <p style={{ color: muted }}>{website}</p>}
        </div>
        <div className="text-right">
          <p className="mb-3.5 text-[30px] leading-none font-light tracking-[0.04em]" style={{ color: muted }}>INVOICE</p>
          <table className="ml-auto border-collapse">
            <tbody>
              {[
                ["Invoice number", inv.number || "Assigned on save"],
                ["Invoice date", formatDate(inv.issueDate)],
                ["Payment terms", Number(inv.termsDays) ? `Due in ${inv.termsDays} days` : "Due on receipt"],
                ["Due date", formatDate(inv.dueDate)],
                ["Currency", cur],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td className="py-0.5 pl-[18px]" style={{ color: muted }}>{k}</td>
                  <td className="py-0.5 pl-[18px] font-semibold">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>

      <div className="my-3.5 flex h-[3px] overflow-hidden rounded-sm">
        <div className="w-[30%]" style={{ background: ink }} />
        <div className="flex-1" style={{ background: brand }} />
      </div>

      <section className="mb-3.5 flex gap-6">
        <div className="flex-1">
          <Label>FROM</Label>
          <p className="text-[11.5px] font-bold">{b.name}</p>
          {b.ownerName && <p>{b.ownerName}{b.ownerTitle && ` (${b.ownerTitle})`}</p>}
          {b.address && <p className="whitespace-pre-line">{b.address}</p>}
          <KeyValues rows={b.taxIds} />
        </div>
        <div className="flex-1">
          <Label>BILL TO</Label>
          <p className="text-[11.5px] font-bold">{inv.client.name || "Client name"}</p>
          {inv.client.address && <p className="whitespace-pre-line">{inv.client.address}</p>}
          <KeyValues rows={inv.client.ids} />
        </div>
        <div className="relative w-[190px] self-start rounded-md px-3.5 py-3" style={{ background: "#f5f7fa" }}>
          {inv.status === "paid" && <span className="absolute top-2.5 right-3 rounded px-1.5 py-0.5 text-[9px] font-bold tracking-widest" style={{ color: "#0b7a3e", background: "#dff5e8" }}>PAID</span>}
          {inv.status === "void" && <span className="absolute top-2.5 right-3 rounded px-1.5 py-0.5 text-[9px] font-bold tracking-widest" style={{ color: "#a3261b", background: "#fde4e1" }}>VOID</span>}
          <Label>AMOUNT DUE ({cur})</Label>
          <p className="my-0.5 text-[22px] font-bold" style={{ color: "#0a1f44" }}>{formatMoney(Math.max(t.balance, 0), cur)}</p>
          <p className="text-[10px]" style={{ color: muted }}>
            {paidInFull ? `Paid in full${inv.paidAt ? ` on ${formatDate(inv.paidAt)}` : ""}` : inv.dueDate ? `Due by ${formatDate(inv.dueDate)}` : ""}
          </p>
        </div>
      </section>

      {strip.length > 0 && (
        <div className="mb-3 flex rounded-md border" style={{ borderColor: "#e3e6ea" }}>
          {strip.map(([k, v], i) => (
            <div key={k} className="flex-1 px-3 py-2" style={i ? { borderLeft: "1px solid #e3e6ea" } : undefined}>
              <Label>{k.toUpperCase()}</Label>
              <p className="font-semibold">{v}</p>
            </div>
          ))}
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-[9px] tracking-[0.06em]" style={{ color: muted, background: "#f5f7fa" }}>
            <th className="px-2.5 py-2 font-semibold" style={{ width: "56%" }}>DESCRIPTION</th>
            {showQty && <th className="px-2.5 py-2 text-right font-semibold">QTY</th>}
            <th className="px-2.5 py-2 text-right font-semibold">UNIT PRICE</th>
            <th className="px-2.5 py-2 text-right font-semibold">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {inv.items.map((item, i) => (
            <tr key={i} className="align-top" style={{ borderBottom: "1px solid #eef0f2" }}>
              <td className="px-2.5 py-[7px]">
                <p className="mb-0.5 text-[11px] font-bold">{item.title || "Item title"}</p>
                <div className="text-[9.6px]" style={{ color: muted }}>
                  {item.ref && <p>{item.ref}</p>}
                  {item.bullets.filter((x) => x.trim()).length > 0 && (
                    <ul className="mt-0.5 ml-[13px] list-disc">
                      {item.bullets.filter((x) => x.trim()).map((x, j) => <li key={j} className="my-px">{x}</li>)}
                    </ul>
                  )}
                </div>
              </td>
              {showQty && <td className="px-2.5 py-[7px] text-right whitespace-nowrap">{Number(item.qty) || 0}</td>}
              <td className="px-2.5 py-[7px] text-right whitespace-nowrap">{formatMoney(Number(item.price) || 0, cur)}</td>
              <td className="px-2.5 py-[7px] text-right whitespace-nowrap">{formatMoney(lineAmount(item), cur)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2.5 flex justify-end">
        <table className="w-[270px] border-collapse">
          <tbody>
            <tr style={{ color: muted }}><td className="px-2.5 py-[3px]">Subtotal</td><td className="px-2.5 py-[3px] text-right">{formatMoney(t.subtotal, cur)}</td></tr>
            <tr style={{ color: muted }}><td className="px-2.5 py-[3px]">{taxLine}</td><td className="px-2.5 py-[3px] text-right">{formatMoney(t.taxAmount, cur)}</td></tr>
            <tr className="font-bold" style={{ borderTop: "1px solid #e3e6ea" }}><td className="px-2.5 pt-2 pb-[3px]">Total</td><td className="px-2.5 pt-2 pb-[3px] text-right">{formatMoney(t.total, cur)}</td></tr>
            <tr style={{ color: muted }}><td className="px-2.5 py-[3px]">Amount paid</td><td className="px-2.5 py-[3px] text-right">{formatMoney(t.paid, cur)}</td></tr>
            <tr className="text-[12.5px] font-bold text-white">
              <td className="rounded-l-[5px] px-2.5 py-[9px]" style={{ background: brand }}>Balance due ({cur})</td>
              <td className="rounded-r-[5px] px-2.5 py-[9px] text-right" style={{ background: brand }}>{formatMoney(t.balance, cur)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {(inv.noteTitle || inv.noteBody) && (
        <div className="mt-3 rounded-r-md border-l-[3px] px-3 py-2.5" style={{ borderColor: brand, background: "#f0f4ff" }}>
          {inv.noteTitle && <p className="text-[11.5px] font-bold" style={{ color: "#0a1f44" }}>{inv.noteTitle}</p>}
          {inv.noteBody && <p className="mt-0.5 text-[9.8px]" style={{ color: "#3d4247" }}>{inv.noteBody}</p>}
        </div>
      )}

      <section className="mt-3 mb-2.5 flex gap-6">
        <div className="flex-1">
          {bank.some((r) => r.value) && (
            <>
              <Label>PAYMENT DETAILS</Label>
              <div className="text-[10px]"><KeyValues rows={bank} labelWidth={92} /></div>
            </>
          )}
        </div>
        <div className="flex-1">
          {inv.notes && (
            <>
              <Label>NOTES</Label>
              <p className="text-[9.8px] whitespace-pre-line" style={{ color: "#3d4247" }}>{inv.notes}</p>
            </>
          )}
        </div>
      </section>

      <footer className="mt-auto flex justify-between border-t pt-2 text-[8.6px]" style={{ borderColor: "#e3e6ea", color: "#8a9096" }}>
        <span>{b.footerText}</span>
        <span style={{ color: "#a3a9ae" }}>{website}</span>
      </footer>
    </div>
  );
}
