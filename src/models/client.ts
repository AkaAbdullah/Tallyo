import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const labelValue = new Schema({ label: { type: String, default: "" }, value: { type: String, default: "" } }, { _id: false });

/** A business the workspace bills. Invoices keep their own copy of these details. */
const clientSchema = new Schema(
  {
    organizationId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    country: { type: String, default: "" },
    ids: { type: [labelValue], default: [] },
    currency: { type: String, default: "USD" },
    taxMode: { type: String, enum: ["reverse_charge", "none", "rate"], default: "none" },
    taxRate: { type: Number, default: 0 },
    taxLabel: { type: String, default: "VAT" },
    noteTitle: { type: String, default: "" },
    noteBody: { type: String, default: "" },
    notes: { type: String, default: "" }, // internal, never printed
  },
  { timestamps: true },
);

clientSchema.index({ organizationId: 1, name: 1 });

export type Client = InferSchemaType<typeof clientSchema> & { _id: mongoose.Types.ObjectId };

export const ClientModel: Model<Client> =
  (mongoose.models.Client as Model<Client>) ?? mongoose.model<Client>("Client", clientSchema);
