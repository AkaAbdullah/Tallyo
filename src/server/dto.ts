import "server-only";
import type { Business } from "@/models/business";
import type { Client } from "@/models/client";
import type { Invoice } from "@/models/invoice";
import type { TemplateId } from "@/pdf/registry";

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
    invoiceTemplate: (b.invoiceTemplate ?? "classic") as TemplateId,
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

export function invoiceDTO(i: Invoice) {
  return {
    id: String(i._id), number: i.number, status: i.status as "draft" | "sent" | "paid" | "void", clientId: i.clientId,
    client: { name: i.client?.name ?? "", address: i.client?.address ?? "", country: i.client?.country ?? "", ids: rows(i.client?.ids) },
    issueDate: i.issueDate, termsDays: i.termsDays, dueDate: i.dueDate, currency: i.currency, project: i.project,
    serviceType: i.serviceType, serviceFrom: i.serviceFrom, serviceTo: i.serviceTo, serviceOngoing: i.serviceOngoing,
    items: i.items.map((x) => ({ title: x.title, ref: x.ref, bullets: [...x.bullets], qty: x.qty, price: x.price })),
    taxMode: i.taxMode as "reverse_charge" | "none" | "rate", taxRate: i.taxRate, taxLabel: i.taxLabel,
    noteTitle: i.noteTitle, noteBody: i.noteBody, notes: i.notes, paymentReference: i.paymentReference,
    total: i.total, amountPaid: i.amountPaid, paidAt: i.paidAt,
    template: (i.template ?? "") as TemplateId | "",
  };
}
export type InvoiceDTO = ReturnType<typeof invoiceDTO>;
