import Link from "next/link";
import { FileText, Sparkles, Users, Globe2 } from "lucide-react";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { getSession } from "@/server/session";

const features = [
  { icon: FileText, title: "Invoices that look professional", text: "Clean PDF invoices with your logo, tax IDs and bank details." },
  { icon: Sparkles, title: "AI does the busywork", text: "Paste a client's message to create the client, or describe the work to draft line items." },
  { icon: Globe2, title: "Built for cross-border work", text: "Any currency, reverse-charge and export notes, and your own legal details." },
  { icon: Users, title: "Workspaces and teams", text: "Run several businesses and invite your team to each one." },
];

export default async function Home() {
  const session = await getSession();
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-2">
          <a href="https://github.com/AkaAbdullah/Tallyo" className={buttonVariants({ variant: "ghost" })}>GitHub</a>
          {session ? (
            <Link href="/dashboard" className={buttonVariants()}>Open app</Link>
          ) : (
            <>
              <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>Sign in</Link>
              <Link href="/sign-up" className={buttonVariants()}>Get started</Link>
            </>
          )}
        </nav>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6">
        <section className="py-20 text-center sm:py-28">
          <p className="mb-4 inline-block rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
            Free and open source
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Invoicing that keeps a tidy tally.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-pretty text-muted-foreground">
            Create, send and track invoices for your business in minutes. Self-host it, or use it as it is.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href={session ? "/dashboard" : "/sign-up"} className={buttonVariants({ size: "lg" })}>
              {session ? "Open your dashboard" : "Create your first invoice"}
            </Link>
          </div>
        </section>
        <section className="grid gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-5">
              <f.icon className="mb-3 size-5 text-primary" />
              <h2 className="font-medium">{f.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </section>
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">Tallyo · MIT licensed</footer>
    </div>
  );
}
