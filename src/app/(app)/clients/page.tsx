import Link from "next/link";
import { Search } from "lucide-react";
import { FlashToast } from "@/components/app/flash-toast";
import { PageHeader } from "@/components/app/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COUNTRIES } from "@/lib/geo";
import { TAX_MODES } from "@/lib/tax";
import { ClientModel } from "@/models/client";
import { requireWorkspace } from "@/server/session";

export const metadata = { title: "Clients" };

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default async function ClientsPage({ searchParams }: PageProps<"/clients">) {
  const { q = "", saved } = (await searchParams) as { q?: string; saved?: string };
  const { workspace } = await requireWorkspace();
  const query = q.trim().slice(0, 80);
  const filter = query
    ? { organizationId: workspace.id, name: { $regex: escapeRegex(query), $options: "i" } }
    : { organizationId: workspace.id };
  const [clients, total] = await Promise.all([
    ClientModel.find(filter).sort({ name: 1 }).limit(200).lean(),
    ClientModel.countDocuments({ organizationId: workspace.id }),
  ]);
  const countryName = (code: string) => COUNTRIES.find((c) => c.code === code)?.name ?? "";
  const taxLabel = (mode: string, rate: number, label: string) =>
    mode === "rate" ? `${label} ${rate}%` : TAX_MODES.find((m) => m.value === mode)?.label ?? "";

  return (
    <>
      <FlashToast message={saved ? `${saved} saved` : undefined} />
      <PageHeader title="Clients" description={total ? `${total} ${total === 1 ? "client" : "clients"} in this workspace.` : "The businesses you bill."}>
        {total > 0 && <Link href="/clients/new" className={buttonVariants({ size: "lg" })}>Add client</Link>}
      </PageHeader>

      {total === 0 ? (
        <div className="rounded-xl border border-dashed border-rule px-6 py-16 text-center">
          <h2 className="text-lg font-semibold">Add the first business you bill</h2>
          <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
            Their address, VAT number, currency and tax note are filled in for you on every invoice.
          </p>
          <Link href="/clients/new" className={buttonVariants({ size: "lg", className: "mt-6" })}>Add a client</Link>
        </div>
      ) : (
        <>
          <form className="relative mb-4 max-w-sm" role="search">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={query} placeholder="Search clients" aria-label="Search clients" className="pl-8" />
          </form>
          {clients.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">
              No clients match &ldquo;{query}&rdquo;. <Link href="/clients" className="text-primary underline-offset-4 hover:underline">Show all clients</Link>
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-rule">
              <table className="w-full text-sm">
                <thead className="border-b border-rule bg-muted/50 text-left text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-medium">Client</th>
                    <th scope="col" className="hidden px-4 py-2.5 font-medium sm:table-cell">Country</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Currency</th>
                    <th scope="col" className="hidden px-4 py-2.5 font-medium md:table-cell">Tax</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  {clients.map((c) => {
                    const vat = c.ids.find((i) => /vat/i.test(i.label ?? ""))?.value;
                    return (
                      <tr key={String(c._id)} className="relative hover:bg-muted/40">
                        <td className="px-4 py-3">
                          <Link href={`/clients/${c._id}`} className="font-medium after:absolute after:inset-0 focus-visible:outline-none">
                            {c.name}
                          </Link>
                          {vat && <p className="text-muted-foreground">VAT ID {vat}</p>}
                        </td>
                        <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{countryName(c.country) || "Not specified"}</td>
                        <td className="px-4 py-3">{c.currency}</td>
                        <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{taxLabel(c.taxMode, c.taxRate, c.taxLabel)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}
