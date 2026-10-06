import { PageIntro } from "@/components/site/page-intro";
import { buttonVariants } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/site";

export const metadata = { title: "Self-hosting" };

const steps: { title: string; text: string; code?: string }[] = [
  { title: "Get the code", text: "You need Node.js 20.9 or newer and pnpm.", code: `git clone ${GITHUB_URL}.git\ncd Tallyo\npnpm install` },
  {
    title: "Add your settings",
    text: "Copy the example file, then set a MongoDB connection string and a long random secret. A free MongoDB Atlas cluster works well.",
    code: "cp .env.example .env.local\nopenssl rand -base64 32   # paste into BETTER_AUTH_SECRET",
  },
  { title: "Start it", text: "For a quick look, leave MONGODB_URI empty and Tallyo uses a temporary in-memory database.", code: "pnpm dev" },
  {
    title: "Deploy",
    text: "Build and run it on any host that supports Next.js, such as Vercel, Railway, Render or your own server. Set BETTER_AUTH_URL to your public address.",
    code: "pnpm build\npnpm start",
  },
];

const stack = [
  ["Next.js 16", "App Router and Server Actions"],
  ["MongoDB", "With Mongoose for app data"],
  ["Better Auth", "Accounts, sessions and workspaces"],
  ["Tailwind CSS 4", "With shadcn/ui components"],
  ["Groq", "Optional AI features"],
  ["MIT license", "Use it for anything"],
];

export default function OpenSourcePage() {
  return (
    <>
      <PageIntro title="Run Tallyo yourself">
        The full app is open source. Host it for your business or your clients, change anything you like, and send
        improvements back if you want to.
      </PageIntro>
      <section className="mx-auto grid max-w-6xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
        <ol className="grid gap-10">
          {steps.map((s, i) => (
            <li key={s.title} className="grid gap-x-5 sm:grid-cols-[2.5rem_1fr]">
              <span className="tabular flex size-9 items-center justify-center rounded-full border-2 border-carbon font-semibold text-carbon">
                {i + 1}
              </span>
              <div className="min-w-0">
                <h2 className="mt-1 text-lg font-semibold">{s.title}</h2>
                <p className="mt-1 leading-relaxed text-muted-foreground">{s.text}</p>
                {s.code && (
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-[#1e2026] p-4 text-[13px] leading-6 text-white/85"><code>{s.code}</code></pre>
                )}
              </div>
            </li>
          ))}
        </ol>
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <h2 className="font-semibold">What it is built with</h2>
          <dl className="mt-4 divide-y divide-rule border-y border-rule">
            {stack.map(([name, note]) => (
              <div key={name} className="flex justify-between gap-4 py-3 text-sm">
                <dt className="font-medium">{name}</dt>
                <dd className="text-right text-muted-foreground">{note}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 grid gap-2">
            <a href={GITHUB_URL} className={buttonVariants({ size: "lg" })}>View the repository</a>
            <a href={`${GITHUB_URL}/issues`} className={buttonVariants({ variant: "outline", size: "lg" })}>Report a bug or suggest a feature</a>
          </div>
        </aside>
      </section>
    </>
  );
}
