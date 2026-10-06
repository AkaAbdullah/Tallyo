export function PageIntro({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-14 sm:px-6 lg:pt-20">
        <h1 className="max-w-2xl text-4xl leading-[1.08] font-semibold tracking-[-0.025em] text-balance sm:text-5xl">{title}</h1>
        <div className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </section>
  );
}
