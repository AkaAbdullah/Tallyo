import { cn } from "@/lib/utils";

const items = [
  { title: "Website design and build", detail: "12 pages, CMS for products, responsive", amount: "2,400.00" },
  { title: "Energy savings calculator", detail: "Embedded web app with lead form", amount: "900.00" },
  { title: "German and French localization", detail: "Copy, CMS fields and calculator", amount: "350.00" },
];

function Sheet({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("absolute inset-0 rounded-[3px] border border-black/10 shadow-[0_1px_0_rgba(30,32,38,.04),0_12px_32px_-12px_rgba(30,32,38,.18)]", className)}>
      {children}
    </div>
  );
}

/** The landing page hero: an invoice on top of its yellow and pink carbon copies. */
export function InvoiceStack() {
  return (
    <div className="relative mx-auto aspect-[1/1.18] w-full max-w-[460px]" aria-label="Example invoice" role="img">
      <Sheet className="copy-2 bg-[#f6cfd8]" />
      <Sheet className="copy-1 bg-[#fcefa4]" />
      <Sheet className="flex flex-col bg-white p-7 text-[13px] text-[#1e2026] sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-semibold">Hollis &amp; Reed</p>
            <p className="text-[#1e2026]/60">Design and development studio</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-light tracking-tight text-[#1e2026]/70">Invoice</p>
            <p className="tabular text-[#1e2026]/60">INV-000142</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-y border-[#1e2026]/10 py-4">
          <div>
            <p className="text-[#1e2026]/50">Billed to</p>
            <p className="font-medium">Waldblick Energie GmbH</p>
            <p className="text-[#1e2026]/60">VAT ID DE123456789</p>
          </div>
          <div className="text-right">
            <p className="text-[#1e2026]/50">Due</p>
            <p className="font-medium">14 November 2026</p>
            <p className="text-[#1e2026]/60">Net 14</p>
          </div>
        </div>

        <ul className="mt-2 divide-y divide-[#1e2026]/10">
          {items.map((i) => (
            <li key={i.title} className="flex justify-between gap-4 py-3">
              <div>
                <p className="font-medium">{i.title}</p>
                <p className="text-[#1e2026]/55">{i.detail}</p>
              </div>
              <p className="tabular shrink-0 font-medium">€{i.amount}</p>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <div className="flex justify-between border-t border-[#1e2026]/10 pt-3 text-[#1e2026]/60">
            <span>VAT 0%, reverse charge</span><span className="tabular">€0.00</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between rounded-[3px] bg-[#3341a6] px-3 py-2.5 text-white">
            <span className="font-medium">Balance due</span>
            <span className="tabular text-lg font-semibold">€3,650.00</span>
          </div>
          <p className="mt-3 text-[11.5px] leading-snug text-[#1e2026]/55">
            Reverse charge: VAT payable by the recipient (Art. 196 Directive 2006/112/EC).
          </p>
        </div>
      </Sheet>
    </div>
  );
}
