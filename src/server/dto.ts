import "server-only";
import type { Business } from "@/models/business";
import type { Client } from "@/models/client";

const rows = (list: { label?: string | null; value?: string | null }[] = []) =>
  list.map((r) => ({ label: r.label ?? "", value: r.value ?? "" }));

/** Plain, serialisable business profile for client components. */
export function businessDTO(b: Business) {
  return {
    name: b.name, legalForm: b.legalForm, ownerName: b.ownerName, ownerTitle: b.ownerTitle, address: b.address,
    country: b.country, email: b.email, phone: b.phone, website: b.website, logo: b.logo, brandColor: b.brandColor,
    taxIds: rows(b.taxIds), bankDetails: rows(b.bankDetails), footerText: b.footerText, invoicePrefix: b.invoicePrefix,
    numberDigits: b.numberDigits, nextNumber: b.nextNumber, defaultCurrency: b.defaultCurrency,
    defaultTermsDays: b.defaultTermsDays, defaultNotes: b.defaultNotes,
  };
}
export type BusinessDTO = ReturnType<typeof businessDTO>;

export function clientDTO(c: Client) {
  return {
    id: String(c._id), name: c.name, email: c.email, address: c.address, country: c.country, ids: rows(c.ids),
    currency: c.currency, taxMode: c.taxMode as "reverse_charge" | "none" | "rate", taxRate: c.taxRate,
    taxLabel: c.taxLabel, noteTitle: c.noteTitle, noteBody: c.noteBody, notes: c.notes,
  };
}
export type ClientDTO = ReturnType<typeof clientDTO>;
