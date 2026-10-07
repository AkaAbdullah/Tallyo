import Image from "next/image";
import Link from "next/link";
import { breadcrumbs, JsonLd } from "@/components/site/json-ld";
import { PageIntro } from "@/components/site/page-intro";
import { buttonVariants } from "@/components/ui/button";
import { pageMetadata, SITE_URL } from "@/lib/site";
import { TEMPLATES } from "@/pdf/registry";

export const metadata = pageMetadata({
  title: "Free invoice templates (PDF) for freelancers",
  description:
    "Four free invoice templates: Classic, Minimal, Bold and Compact. Add your logo and brand colour, fill in your details and download a PDF invoice.",
  path: "/invoice-templates",
});

const uses: Record<string, string> = {
  classic: "A safe choice for any client. The amount due and payment details are easy to find, and there is room for project details and a tax note.",
  minimal: "For designers, writers and consultants who want the invoice to feel as considered as their work. Black and white, with your brand colour only on the amount due.",
  bold: "Puts your brand first with a full-width header in your colour. Good for studios and agencies with a strong visual identity.",
  compact: "Fits long invoices on fewer pages: monthly retainers, hourly work and anything with many line items.",
};

const includes = [
  ["Your business details", "Name, legal form, address, phone, email and website, with your logo."],
  ["Tax and registration numbers", "VAT ID, company number or any number your clients need, for you and for them."],
  ["Invoice number and dates", "Automatic numbering, invoice date, payment terms and due date."],
  ["Line items with detail", "A title, an optional quote reference and bullet points for what you delivered."],
  ["Tax handled correctly", "A tax rate, or a 0% reverse-charge or export note with the wording accountants expect."],
  ["Payment details", "Bank account, IBAN, SWIFT or a payment link, plus the reference to quote."],
];

export default function InvoiceTemplatesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([["Invoice templates", "/invoice-templates"]]),
          {
            "@type": "ItemList",
            name: "Tallyo invoice templates",
            itemListElement: TEMPLATES.map((t, i) => ({
              "@type": "ListItem", position: i + 1, name: `${t.name} invoice template`, image: `${SITE_URL}/templates/${t.id}.png`,
            })),
          },
        ]}
      />
      <PageIntro title="Free invoice templates for freelancers and small businesses">
        Pick a template, add your logo and brand colour, and Tallyo fills in the rest: your tax numbers, the client&apos;s
        details, totals and the right tax note. Every invoice downloads as a PDF.
      </PageIntro>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-label="Templates">
        <ul className="grid gap-10 sm:grid-cols-2">
          {TEMPLATES.map((t, i) => (
            <li key={t.id} className="grid gap-4">
              <Image
                priority={i === 0}
                src={`/templates/${t.id}.png`}
                alt={`${t.name} invoice template: an example PDF invoice`}
                width={595}
                height={842}
                sizes="(min-width: 640px) 45vw, 100vw"
                className="w-full rounded-md border border-rule bg-white shadow-[0_12px_32px_-14px_rgba(30,32,38,.3)]"
              />
              <div>
                <h2 className="text-xl font-semibold">{t.name} invoice template</h2>
                <p className="mt-1.5 leading-relaxed text-muted-foreground">{uses[t.id]}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-rule bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_2fr]">
          <h2 className="max-w-xs text-2xl font-semibold tracking-tight text-balance">What every template includes</h2>
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {includes.map(([title, text]) => (
              <div key={title}>
                <dt className="font-semibold">{title}</dt>
                <dd className="mt-1 leading-relaxed text-muted-foreground">{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-14 sm:px-6">
        <p className="max-w-xl text-2xl font-semibold tracking-tight">Make your first invoice with any of these templates. It&apos;s free.</p>
        <Link href="/sign-up" className={buttonVariants({ size: "lg" })}>Create an invoice</Link>
      </section>
    </>
  );
}
