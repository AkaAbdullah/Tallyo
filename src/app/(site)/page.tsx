import Link from "next/link";
import { InvoiceStack } from "@/components/site/invoice-stack";
import { buttonVariants } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Set up your business once",
    text: "Add your logo, address, tax numbers and bank details. They appear on every invoice, so you never retype them.",
  },
  {
    title: "Save your clients",
    text: "Each client keeps their own currency, VAT ID and tax note. Pick them from a list when you bill them.",
  },
  {
    title: "Send the invoice, then mark it paid",
    text: "Download a clean PDF, send it the way you always do, and see at a glance what is still outstanding.",
  },
];

const borderFacts = [
  ["Any currency", "Bill in euros, dollars, pounds, rupees or any of 150+ currencies, per client."],
  ["Reverse charge, done right", "Zero-rated EU business invoices carry the note your client's accountant expects."],
  ["Your registration numbers", "Tax, company and VAT numbers go exactly where you put them, in your words."],
  ["Bank details that fit", "IBAN, SWIFT, account title or a payment link. Whatever your clients need to pay you."],
];

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:pt-20 lg:pb-28">
        <div className="max-w-xl">
          <h1 className="text-[2.6rem] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-6xl">
            Proper invoices for independent work.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-pretty text-muted-foreground">
            Tallyo puts your tax numbers, bank details and the right VAT note on every invoice, and keeps track of
            who has paid. It is free, and the code is yours to run.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/sign-up" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base")}>
              Create your first invoice
            </Link>
            <Link href="/open-source" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5 text-base")}>
              Host it yourself
            </Link>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">No card, no trial clock. MIT licensed.</p>
        </div>
        <div className="pr-6 pb-8 sm:pr-8">
          <InvoiceStack />
        </div>
      </section>

      <section className="border-t border-rule bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="max-w-md text-3xl font-semibold tracking-tight text-balance">From a new client to money in the bank</h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t-2 border-carbon pt-5">
                <span className="tabular text-sm font-semibold text-carbon">Step {i + 1}</span>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">Paste their email. Get a client.</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Clients send their billing details in a message. Paste it into Tallyo and the AI pulls out the company
            name, address and VAT number for you to check and save. It can also turn a rough description of the job
            into tidy line items.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Optional, and off unless you add a Groq API key.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <figure className="rounded-lg border border-rule bg-muted/50 p-5 text-sm leading-relaxed">
            <figcaption className="mb-3 text-muted-foreground">Lena from Waldblick Energie</figcaption>
            <p>
              Please issue the invoice to our GmbH:
              <br />
              Waldblick Energie GmbH
              <br />
              Musterstraße 1, 10115 Berlin
              <br />
              VAT ID DE123456789
            </p>
            <p className="mt-3">No German VAT please, just add the reverse charge note.</p>
          </figure>
          <div className="rounded-lg border border-carbon/40 bg-accent/60 p-5 text-sm">
            <p className="mb-3 font-medium text-carbon">New client</p>
            <dl className="grid gap-2.5">
              {[
                ["Company", "Waldblick Energie GmbH"],
                ["Address", "Musterstraße 1, 10115 Berlin, Germany"],
                ["VAT ID", "DE123456789"],
                ["Tax", "Reverse charge (EU business)"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="border-y border-rule">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          <h2 className="max-w-sm text-3xl font-semibold tracking-tight text-balance">
            Made by a studio that bills clients in other countries
          </h2>
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {borderFacts.map(([title, text]) => (
              <div key={title}>
                <dt className="font-semibold">{title}</dt>
                <dd className="mt-1.5 leading-relaxed text-muted-foreground">{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="grid gap-10 rounded-xl bg-[#1e2026] p-8 text-white sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-balance">Your invoices can live on your own server.</h2>
            <p className="mt-4 max-w-md leading-relaxed text-white/70">
              Tallyo is open source. Run it on your own machine or any host that runs Node.js, point it at a MongoDB
              database, and your billing data never leaves your hands.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sign-up" className={cn(buttonVariants({ size: "lg" }), "h-11 bg-white px-5 text-base text-[#1e2026] hover:bg-white/90")}>
                Use Tallyo now
              </Link>
              <a href={GITHUB_URL} className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "h-11 px-5 text-base text-white hover:bg-white/10 hover:text-white")}>
                Read the code on GitHub
              </a>
            </div>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-black/30 p-5 text-[13px] leading-6 text-white/85">
            <code>{`git clone ${GITHUB_URL}.git
cd Tallyo
pnpm install
cp .env.example .env.local
pnpm dev`}</code>
          </pre>
        </div>
      </section>
    </>
  );
}
