import { PageHeader } from "@/components/app/page-header";
import { COUNTRIES, CURRENCIES_SORTED } from "@/lib/geo";
import { requireWorkspace } from "@/server/session";
import { ClientForm } from "../client-form";

export const metadata = { title: "New client" };

export default async function NewClientPage() {
  const { business } = await requireWorkspace();
  return (
    <>
      <PageHeader title="New client" description="Save their details once and reuse them on every invoice." />
      <ClientForm sellerCountry={business.country} defaultCurrency={business.defaultCurrency} countries={COUNTRIES} currencies={CURRENCIES_SORTED} />
    </>
  );
}
