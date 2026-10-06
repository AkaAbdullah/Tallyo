import { PageHeader } from "@/components/app/page-header";

export const metadata = { title: "Clients" };

export default function Page() {
  return (
    <>
      <PageHeader title="Clients" description="The businesses you bill." />
      <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">Coming in the next step.</div>
    </>
  );
}
