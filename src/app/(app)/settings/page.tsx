import { PageHeader } from "@/components/app/page-header";
import { COUNTRIES, CURRENCIES_SORTED } from "@/lib/geo";
import { businessDTO } from "@/server/dto";
import { requireWorkspace } from "@/server/session";
import { SettingsForm } from "./settings-form";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { business } = await requireWorkspace();
  return (
    <>
      <PageHeader title="Business settings" description="These details appear on every invoice from this workspace." />
      <SettingsForm key={String(business.updatedAt)} business={businessDTO(business)} countries={COUNTRIES} currencies={CURRENCIES_SORTED} />
    </>
  );
}
