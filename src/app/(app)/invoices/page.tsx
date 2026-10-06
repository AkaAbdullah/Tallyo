import { PageHeader } from "@/components/app/page-header";

export const metadata = { title: "Invoices" };

export default function Page() {
  return (
    <>
      <PageHeader title="Invoices" description="Create, send and track your invoices." />
      <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">Coming in the next step.</div>
    </>
  );
}
