import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const labelValue = new Schema({ label: { type: String, default: "" }, value: { type: String, default: "" } }, { _id: false });

const lineItem = new Schema(
  {
    title: { type: String, required: true },
    ref: { type: String, default: "" },
    bullets: { type: [String], default: [] },
    qty: { type: Number, default: 1 },
    price: { type: Number, default: 0 },
  },
  { _id: false },
);

/**
 * An invoice. The client's details are copied in when the invoice is saved, so later edits to the
 * client never change invoices already issued. Dates are "YYYY-MM-DD" strings.
 */
const invoiceSchema = new Schema(
  {
    organizationId: { type: String, required: true },
    number: { type: String, required: true },
    status: { type: String, enum: ["draft", "sent", "paid", "void"], default: "draft" },
    clientId: { type: String, default: "" },
    client: {
      name: { type: String, required: true },
      address: { type: String, default: "" },
      country: { type: String, default: "" },
      ids: { type: [labelValue], default: [] },
    },
    issueDate: { type: String, required: true },
    termsDays: { type: Number, default: 14 },
    dueDate: { type: String, required: true },
    currency: { type: String, required: true },
    project: { type: String, default: "" },
    serviceType: { type: String, default: "" },
    serviceFrom: { type: String, default: "" },
    serviceTo: { type: String, default: "" },
    serviceOngoing: { type: Boolean, default: false },
    items: { type: [lineItem], default: [] },
    taxMode: { type: String, enum: ["reverse_charge", "none", "rate"], default: "none" },
    taxRate: { type: Number, default: 0 },
    taxLabel: { type: String, default: "VAT" },
    noteTitle: { type: String, default: "" },
    noteBody: { type: String, default: "" },
    notes: { type: String, default: "" },
    paymentReference: { type: String, default: "" },
    // "" follows the workspace default template.
    template: { type: String, enum: ["", "classic", "minimal", "bold", "compact"], default: "" },
    // Cached totals so lists and dashboards can sum without recomputing every invoice.
    subtotal: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    sentAt: { type: Date },
    paidAt: { type: String, default: "" },
    createdBy: { type: String, default: "" },
  },
  { timestamps: true },
);

invoiceSchema.index({ organizationId: 1, number: 1 }, { unique: true });
invoiceSchema.index({ organizationId: 1, issueDate: -1 });

export type Invoice = InferSchemaType<typeof invoiceSchema> & { _id: mongoose.Types.ObjectId };
export type InvoiceStatus = "draft" | "sent" | "paid" | "void";

// In development, hot reloads would otherwise keep a stale model that silently drops new fields.
if (process.env.NODE_ENV !== "production" && mongoose.models.Invoice) mongoose.deleteModel("Invoice");

export const InvoiceModel: Model<Invoice> =
  (mongoose.models.Invoice as Model<Invoice>) ?? mongoose.model<Invoice>("Invoice", invoiceSchema);
