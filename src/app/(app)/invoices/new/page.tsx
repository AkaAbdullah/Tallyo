import { PageHeader } from "@/components/app/page-header";
import { aiEnabled } from "@/lib/ai-tasks";
import { InvoiceEditor } from "../invoice-editor";
import { loadEditorContext } from "../editor-context";

export const metadata = { title: "New invoice" };

export default async function NewInvoicePage({ searchParams }: PageProps<"/invoices/new">) {
  const { client } = (await searchParams) as { client?: string };
  const ctx = await loadEditorContext();
  return (
    <>
      <PageHeader title="New invoice" description={`It will be numbered ${ctx.defaults.nextNumber} unless you choose a number.`} />
      <InvoiceEditor business={ctx.business} clients={ctx.clients} defaults={ctx.defaults} currencies={ctx.currencies} aiEnabled={aiEnabled()} preselectClientId={client} />
    </>
  );
}
