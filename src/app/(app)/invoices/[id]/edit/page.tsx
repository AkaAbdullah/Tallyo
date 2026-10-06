import { isValidObjectId } from "mongoose";
import { notFound, redirect } from "next/navigation";
import { FlashToast } from "@/components/app/flash-toast";
import { PageHeader } from "@/components/app/page-header";
import { InvoiceModel } from "@/models/invoice";
import { invoiceDTO } from "@/server/dto";
import { InvoiceEditor } from "../../invoice-editor";
import { loadEditorContext } from "../../editor-context";

export const metadata = { title: "Edit invoice" };

export default async function EditInvoicePage({ params, searchParams }: PageProps<"/invoices/[id]/edit">) {
  const { id } = await params;
  const { duplicated } = (await searchParams) as { duplicated?: string };
  if (!isValidObjectId(id)) notFound();
  const ctx = await loadEditorContext();
  const invoice = await InvoiceModel.findOne({ _id: id, organizationId: ctx.workspace.id }).lean();
  if (!invoice) notFound();
  if (invoice.status === "void") redirect(`/invoices/${id}`);

  return (
    <>
      <FlashToast message={duplicated ? `Copied into a new draft, ${invoice.number}` : undefined} />
      <PageHeader
        title={`Edit ${invoice.number}`}
        description={invoice.status === "draft" ? "Draft. Only you and your team can see it." : "This invoice has already been sent. Changes update the copy in Tallyo, not the one your client has."}
      />
      <InvoiceEditor invoice={invoiceDTO(invoice)} business={ctx.business} clients={ctx.clients} defaults={ctx.defaults} currencies={ctx.currencies} />
    </>
  );
}
