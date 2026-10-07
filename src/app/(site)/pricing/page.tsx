import Link from "next/link";
import { breadcrumbs, faqPage, JsonLd } from "@/components/site/json-ld";
import { PageIntro } from "@/components/site/page-intro";
import { buttonVariants } from "@/components/ui/button";
import { pageMetadata } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Pricing: free invoicing software, no limits",
  description:
    "Tallyo is free: unlimited invoices, clients, PDF downloads and team members. Use the hosted version or self-host the MIT-licensed code on your own server.",
  path: "/pricing",
});

const lines = [
  ["Unlimited invoices", "Free"],
  ["Unlimited clients", "Free"],
  ["Several businesses and team members", "Free"],
  ["PDF downloads", "Free"],
  ["Every future feature", "Free"],
];

const faqs: [string, string][] = [
  ["Why is it free?", "Tallyo is an open-source project. It started as the tool one studio needed for its own invoicing, and it is shared so others can use and improve it."],
  ["What about the AI features?", "They use your own Groq API key, so any cost is between you and Groq. Groq offers a free tier that covers normal invoicing use."],
  ["Can I run it on my own server?", "Yes. The MIT license lets you run, change and redistribute it, including for commercial use."],
  ["Where is my data stored?", "In the MongoDB database the app is connected to. If you host Tallyo yourself, that database is yours."],
];

export default function PricingPage() {
  return (
    <>
      <JsonLd data={[faqPage(faqs), breadcrumbs([["Pricing", "/pricing"]])]} />
      <PageIntro title="Free invoice software, properly itemised">Tallyo costs nothing. That is the whole pricing page, but here it is on a receipt anyway.</PageIntro>
      <section className="mx-auto grid max-w-6xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="mx-auto w-full max-w-md bg-[#fcefa4] p-7 text-[#1e2026] shadow-[0_12px_32px_-14px_rgba(30,32,38,.35)] sm:p-9">
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-semibold">Tallyo</p>
            <p className="text-sm text-[#1e2026]/75">Receipt</p>
          </div>
          <ul className="mt-6 divide-y divide-dashed divide-[#1e2026]/25 border-y border-dashed border-[#1e2026]/25">
            {lines.map(([item, price]) => (
              <li key={item} className="flex justify-between gap-4 py-3">
                <span>{item}</span>
                <span className="shrink-0">{price}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-baseline justify-between">
            <span className="font-semibold">Total due</span>
            <span className="tabular text-3xl font-semibold">$0.00</span>
          </div>
          <p className="mt-6 text-sm text-[#1e2026]/75">Paid in full. Thank you for your business.</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Two ways to use it</h2>
          <div className="mt-6 grid gap-6">
            <div>
              <h3 className="font-semibold">Use this site</h3>
              <p className="mt-1 leading-relaxed text-muted-foreground">Create an account and start invoicing. Nothing to install.</p>
              <Link href="/sign-up" className={cn(buttonVariants({ size: "lg" }), "mt-3")}>Create an account</Link>
            </div>
            <div className="border-t border-rule pt-6">
              <h3 className="font-semibold">Run your own copy</h3>
              <p className="mt-1 leading-relaxed text-muted-foreground">Deploy Tallyo on your own server with your own database.</p>
              <Link href="/open-source" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-3")}>Read the self-hosting guide</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Questions</h2>
          <dl className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {faqs.map(([q, a]) => (
              <div key={q}>
                <dt className="font-semibold">{q}</dt>
                <dd className="mt-1.5 leading-relaxed text-muted-foreground">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
