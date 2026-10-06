import { isValidObjectId } from "mongoose";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { COUNTRIES, CURRENCIES_SORTED } from "@/lib/geo";
import { ClientModel } from "@/models/client";
import { clientDTO } from "@/server/dto";
import { requireWorkspace } from "@/server/session";
import { ClientForm } from "../client-form";
import { DeleteClientButton } from "./delete-client-button";

export default async function EditClientPage({ params }: PageProps<"/clients/[id]">) {
  const { id } = await params;
  const { workspace, business } = await requireWorkspace();
  if (!isValidObjectId(id)) notFound();
  const client = await ClientModel.findOne({ _id: id, organizationId: workspace.id }).lean();
  if (!client) notFound();

  return (
    <>
      <PageHeader title={client.name} description="Changes apply to new invoices. Invoices you have already created keep their details.">
        <div className="flex gap-2">
          <DeleteClientButton id={id} name={client.name} />
          <Link href={`/invoices/new?client=${id}`} className={buttonVariants({ size: "lg" })}>New invoice</Link>
        </div>
      </PageHeader>
      <ClientForm client={clientDTO(client)} sellerCountry={business.country} defaultCurrency={business.defaultCurrency} countries={COUNTRIES} currencies={CURRENCIES_SORTED} />
    </>
  );
}

export async function generateMetadata({ params }: PageProps<"/clients/[id]">) {
  const { id } = await params;
  if (!isValidObjectId(id)) return { title: "Client" };
  const { workspace } = await requireWorkspace();
  const client = await ClientModel.findOne({ _id: id, organizationId: workspace.id }, { name: 1 }).lean();
  return { title: client?.name ?? "Client" };
}
