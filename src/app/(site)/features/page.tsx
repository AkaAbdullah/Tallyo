import Link from "next/link";
import { PageIntro } from "@/components/site/page-intro";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Features" };

const groups: { title: string; summary: string; items: [string, string][] }[] = [
  {
    title: "Invoices",
    summary: "Everything a client, or their accountant, looks for on an invoice.",
    items: [
      ["Live preview", "See the finished invoice as you type, exactly as the PDF will look."],
      ["Automatic numbering", "INV-000388 follows INV-000387. Choose your own prefix and starting number."],
      ["Line items with detail", "A title, an optional quote reference and bullet points for what was delivered."],
      ["Service period", "Show the dates the work covers, including ongoing projects."],
      ["Partial payments", "Record what has been paid and the invoice shows the balance still due."],
      ["Duplicate", "Copy last month's invoice as a new draft for retainers and repeat work."],
    ],
  },
  {
    title: "Tax and legal details",
    summary: "Set once per business and per client, so every invoice is right without thinking about it.",
    items: [
      ["Your registration numbers", "Add as many as you need, labelled your way: NTN, company number, VAT ID."],
      ["Reverse charge", "Zero-rated invoices for EU business clients include the correct note."],
      ["Export of services", "Invoices to clients abroad can state that no sales tax applies, and why."],
      ["Tax at a rate", "Charge VAT or GST at any percentage when you need to."],
    ],
  },
  {
    title: "Clients and workspaces",
    summary: "Built for freelancers, studios and people who run more than one business.",
    items: [
      ["Saved clients", "Address, VAT ID, currency and tax treatment are filled in when you pick a client."],
      ["Several businesses", "Keep each business in its own workspace and switch between them in one click."],
      ["Team members", "Invite a partner or bookkeeper to a workspace."],
      ["History that stays put", "Editing a client later never changes invoices you have already sent."],
    ],
  },
  {
    title: "AI, if you want it",
    summary: "Uses Groq's open models. Nothing runs unless you add an API key.",
    items: [
      ["Message to client", "Paste a client's email and get their company details as a new client."],
      ["Description to line items", "Write what you did in a sentence and get line items to review."],
      ["Clearer wording", "Rewrite item descriptions so they read the way a client expects."],
      ["Tax note suggestions", "Get a suggested tax treatment for a client's country. You make the final call."],
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PageIntro title="What Tallyo does">
        Tallyo is for people who bill clients directly: freelancers, small studios and consultants, including those
        working across borders.
      </PageIntro>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {groups.map((g) => (
          <section key={g.title} className="grid gap-8 border-b border-rule py-14 last:border-b-0 lg:grid-cols-[1fr_2fr]">
            <div className="max-w-xs">
              <h2 className="text-2xl font-semibold tracking-tight">{g.title}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{g.summary}</p>
            </div>
            <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
              {g.items.map(([title, text]) => (
                <div key={title}>
                  <dt className="font-semibold">{title}</dt>
                  <dd className="mt-1 leading-relaxed text-muted-foreground">{text}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      <section className="border-t border-rule bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-14 sm:px-6">
          <p className="text-2xl font-semibold tracking-tight">Ready to send a proper invoice?</p>
          <Link href="/sign-up" className={buttonVariants({ size: "lg" })}>Create an account</Link>
        </div>
      </section>
    </>
  );
}
