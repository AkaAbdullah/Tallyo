"use server";

import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { addDays, computeTotals, formatInvoiceNumber, todayISO } from "@/lib/money";
import { invoiceSchema, type InvoiceInput } from "@/lib/schemas";
import { BusinessModel } from "@/models/business";
import { InvoiceModel } from "@/models/invoice";
import { requireWorkspace } from "@/server/session";

export type SaveInvoiceResult = { error: string; fieldErrors?: Record<string, string> } | undefined;

/** Takes the next free number from the workspace counter (atomic, so two people never get the same one). */
async function claimNextNumber(organizationId: string) {
  for (let attempt = 0; attempt < 50; attempt++) {
    const b = await BusinessModel.findOneAndUpdate({ organizationId }, { $inc: { nextNumber: 1 } }, { new: false }).lean();
    if (!b) throw new Error("Workspace not found");
    const number = formatInvoiceNumber(b.invoicePrefix, b.numberDigits, b.nextNumber);
    if (!(await InvoiceModel.exists({ organizationId, number }))) return number;
  }
  throw new Error("Could not find a free invoice number. Check the next number in Settings.");
}

/** Keeps the counter ahead of manually typed numbers that follow the workspace pattern. */
async function bumpCounterPast(organizationId: string, number: string) {
  const b = await BusinessModel.findOne({ organizationId }, { invoicePrefix: 1 }).lean();
  if (!b || !number.startsWith(b.invoicePrefix)) return;
  const n = Number(number.slice(b.invoicePrefix.length));
  if (Number.isInteger(n) && n > 0) await BusinessModel.updateOne({ organizationId, nextNumber: { $lte: n } }, { $set: { nextNumber: n + 1 } });
}

function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const i of issues) fieldErrors[i.path.map(String).join(".")] ??= i.message;
  return fieldErrors;
}

export async function saveInvoice(id: string | null, input: InvoiceInput, intent: "save" | "send"): Promise<SaveInvoiceResult> {
  const { workspace, user } = await requireWorkspace();
  const parsed = invoiceSchema.safeParse(input);
  if (!parsed.success) return { error: "Some fields need attention.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  const data = parsed.data;
  const totals = computeTotals(data.items, data);
  const fields = {
    ...data,
    taxRate: data.taxMode === "rate" ? data.taxRate : 0,
    serviceTo: data.serviceOngoing ? "" : data.serviceTo,
    dueDate: addDays(data.issueDate, data.termsDays),
    subtotal: totals.subtotal,
    taxAmount: totals.taxAmount,
    total: totals.total,
  };

  let invoiceId = id;
  if (id) {
    if (!isValidObjectId(id)) return { error: "This invoice no longer exists." };
    const existing = await InvoiceModel.findOne({ _id: id, organizationId: workspace.id }).lean();
    if (!existing) return { error: "This invoice no longer exists." };
    if (existing.status === "void") return { error: "Void invoices can't be edited. Duplicate it instead." };
    const number = data.number || existing.number;
    if (number !== existing.number && (await InvoiceModel.exists({ organizationId: workspace.id, number }))) {
      return { error: `${number} is already used by another invoice.`, fieldErrors: { number: "Already used" } };
    }
    const status = intent === "send" && existing.status === "draft" ? "sent" : existing.status;
    await InvoiceModel.updateOne(
      { _id: id },
      { $set: { ...fields, number, status, ...(status === "sent" && !existing.sentAt ? { sentAt: new Date() } : {}) } },
    );
    if (number !== existing.number) await bumpCounterPast(workspace.id, number);
  } else {
    let number = data.number;
    if (number) {
      if (await InvoiceModel.exists({ organizationId: workspace.id, number })) {
        return { error: `${number} is already used by another invoice.`, fieldErrors: { number: "Already used" } };
      }
    } else {
      number = await claimNextNumber(workspace.id);
    }
    const created = await InvoiceModel.create({
      ...fields,
      number,
      organizationId: workspace.id,
      createdBy: user.id,
      status: intent === "send" ? "sent" : "draft",
      ...(intent === "send" ? { sentAt: new Date() } : {}),
    });
    if (data.number) await bumpCounterPast(workspace.id, number);
    invoiceId = String(created._id);
  }
  redirect(`/invoices/${invoiceId}?saved=1`);
}

async function findOwned(id: string) {
  const { workspace } = await requireWorkspace();
  if (!isValidObjectId(id)) throw new Error("This invoice no longer exists.");
  const invoice = await InvoiceModel.findOne({ _id: id, organizationId: workspace.id });
  if (!invoice) throw new Error("This invoice no longer exists.");
  return invoice;
}

export async function markSent(id: string) {
  const invoice = await findOwned(id);
  if (invoice.status !== "draft") return;
  invoice.status = "sent";
  invoice.sentAt = new Date();
  await invoice.save();
  refresh();
}

/** Records a payment. When the balance reaches zero the invoice becomes paid. */
export async function recordPayment(id: string, amount: number, date: string) {
  const invoice = await findOwned(id);
  if (invoice.status === "void") throw new Error("Void invoices can't take payments.");
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) throw new Error("Enter an amount greater than zero.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Enter the date it was paid.");
  invoice.amountPaid = Math.round((invoice.amountPaid + value) * 100) / 100;
  if (invoice.amountPaid >= invoice.total) {
    invoice.status = "paid";
    invoice.paidAt = date;
  } else if (invoice.status === "draft") {
    invoice.status = "sent";
    invoice.sentAt ??= new Date();
  }
  await invoice.save();
  refresh();
}

export async function markPaid(id: string, date = todayISO()) {
  const invoice = await findOwned(id);
  if (invoice.status === "void") throw new Error("Void invoices can't be marked as paid.");
  invoice.amountPaid = invoice.total;
  invoice.status = "paid";
  invoice.paidAt = date;
  invoice.sentAt ??= new Date();
  await invoice.save();
  refresh();
}

/** Undo a payment record: back to sent with nothing paid. */
export async function markUnpaid(id: string) {
  const invoice = await findOwned(id);
  invoice.amountPaid = 0;
  invoice.paidAt = "";
  invoice.status = "sent";
  await invoice.save();
  refresh();
}

export async function voidInvoice(id: string) {
  const invoice = await findOwned(id);
  invoice.status = "void";
  await invoice.save();
  refresh();
}

export async function deleteInvoice(id: string) {
  const invoice = await findOwned(id);
  await invoice.deleteOne();
  redirect("/invoices");
}

/** Copies an invoice into a new draft with the next number and today's date. */
export async function duplicateInvoice(id: string) {
  const source = await findOwned(id);
  const { user } = await requireWorkspace();
  const s = source.toObject();
  const issueDate = todayISO();
  const copy = await InvoiceModel.create({
    organizationId: s.organizationId,
    number: await claimNextNumber(s.organizationId),
    status: "draft",
    clientId: s.clientId, client: s.client, issueDate, termsDays: s.termsDays, dueDate: addDays(issueDate, s.termsDays),
    currency: s.currency, project: s.project, serviceType: s.serviceType, serviceFrom: s.serviceFrom, serviceTo: s.serviceTo,
    serviceOngoing: s.serviceOngoing, items: s.items, taxMode: s.taxMode, taxRate: s.taxRate, taxLabel: s.taxLabel,
    noteTitle: s.noteTitle, noteBody: s.noteBody, notes: s.notes, subtotal: s.subtotal, taxAmount: s.taxAmount,
    total: s.total, amountPaid: 0, createdBy: user.id,
  });
  redirect(`/invoices/${copy._id}/edit?duplicated=1`);
}
