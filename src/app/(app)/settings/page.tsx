import { PageHeader } from "@/components/app/page-header";

export const metadata = { title: "Settings" };

export default function Page() {
  return (
    <>
      <PageHeader title="Settings" description="Your business details, branding and invoice defaults." />
      <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">Coming in the next step.</div>
    </>
  );
}
