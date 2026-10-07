"use server";

import { redirect } from "next/navigation";
import { addDays, computeTotals, formatInvoiceNumber, todayISO } from "@/lib/money";
import { suggestTax } from "@/lib/tax";
import { BusinessModel } from "@/models/business";
import { ClientModel } from "@/models/client";
import { InvoiceModel } from "@/models/invoice";
import { requireWorkspace } from "@/server/session";

const clients = [
  { name: "Waldblick Energie GmbH", address: "Musterstraße 1\n10115 Berlin\nGermany", country: "DE", ids: [{ label: "VAT ID", value: "DE123456789" }], currency: "EUR" },
  { name: "Brightside Coffee Co.", address: "88 Market Street\nSan Francisco, CA 94103\nUnited States", country: "US", ids: [], currency: "USD" },
  { name: "Atelier Verde Ltd", address: "3 Canal Yard\nLondon N1 9AG\nUnited Kingdom", country: "GB", ids: [{ label: "Company no.", value: "12873365" }], currency: "GBP" },
];

type Draft = { client: number; daysAgo: number; status: "draft" | "sent" | "paid"; paidPart?: number; project: string; items: { title: string; bullets: string[]; qty: number; price: number }[] };

const invoices: Draft[] = [
  { client: 0, daysAgo: 52, status: "paid", project: "Website relaunch", items: [{ title: "Website design and build", bullets: ["12 pages with a CMS product catalogue", "Responsive build and launch support"], qty: 1, price: 2400 }, { title: "German and French localization", bullets: ["Copy, CMS fields and calculator"], qty: 1, price: 350 }] },
  { client: 1, daysAgo: 31, status: "sent", project: "Online ordering", items: [{ title: "Ordering flow design", bullets: ["Menu, cart and checkout screens"], qty: 1, price: 1200 }, { title: "Development", bullets: ["Integration with the existing POS"], qty: 24, price: 85 }] },
  { client: 2, daysAgo: 9, status: "sent", paidPart: 0.5, project: "Brand refresh", items: [{ title: "Brand guidelines", bullets: ["Logo usage, colour and typography"], qty: 1, price: 1800 }] },
  { client: 0, daysAgo: 2, status: "draft", project: "Energy savings calculator", items: [{ title: "Calculator web app", bullets: ["Three-step wizard and results page", "Lead form with GDPR consent"], qty: 1, price: 900 }] },
];

/** Adds sample clients and invoices to an empty workspace so people can explore. */
export async function loadSampleData() {
  const { workspace, user, business } = await requireWorkspace();
  if (await InvoiceModel.exists({ organizationId: workspace.id })) redirect("/dashboard");

  // Tax treatment depends on where the user's business is, exactly as for clients they add themselves.
  // Same-country clients get "charge tax" at 0% until the user sets their rate.
  const saved = await ClientModel.insertMany(
    clients.map((c) => ({ ...c, organizationId: workspace.id, ...suggestTax(business.country, c.country) })),
  );
  const today = todayISO();
  const b = await BusinessModel.findOneAndUpdate({ organizationId: workspace.id }, { $inc: { nextNumber: invoices.length } }, { new: false }).lean();
  if (!b) redirect("/dashboard");

  await InvoiceModel.insertMany(
    invoices.map((d, i) => {
      const c = saved[d.client];
      const issueDate = addDays(today, -d.daysAgo);
      const totals = computeTotals(d.items, { taxMode: c.taxMode as "none", taxRate: c.taxRate });
      const amountPaid = d.status === "paid" ? totals.total : d.paidPart ? Math.round(totals.total * d.paidPart * 100) / 100 : 0;
      return {
        organizationId: workspace.id,
        number: formatInvoiceNumber(b.invoicePrefix, b.numberDigits, b.nextNumber + i),
        status: d.status,
        clientId: String(c._id),
        client: { name: c.name, address: c.address, country: c.country, ids: c.ids },
        issueDate, termsDays: 14, dueDate: addDays(issueDate, 14), currency: c.currency,
        project: d.project, serviceType: "Design and development",
        items: d.items.map((x) => ({ ...x, ref: "" })),
        taxMode: c.taxMode, taxRate: c.taxRate, taxLabel: c.taxLabel, noteTitle: c.noteTitle, noteBody: c.noteBody,
        notes: b.defaultNotes, subtotal: totals.subtotal, taxAmount: totals.taxAmount, total: totals.total,
        amountPaid, paidAt: d.status === "paid" ? addDays(issueDate, 10) : "",
        sentAt: d.status === "draft" ? undefined : new Date(), createdBy: user.id,
      };
    }),
  );
  redirect("/dashboard?sample=1");
}
