import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const labelValue = new Schema({ label: { type: String, default: "" }, value: { type: String, default: "" } }, { _id: false });

/** A workspace's business profile: everything printed in the "From" part of an invoice. */
const businessSchema = new Schema(
  {
    organizationId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    legalForm: { type: String, default: "" },
    ownerName: { type: String, default: "" },
    ownerTitle: { type: String, default: "" },
    address: { type: String, default: "" },
    country: { type: String, default: "" }, // ISO 3166-1 alpha-2
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    website: { type: String, default: "" },
    logo: { type: String, default: "" }, // data URL, kept small (validated on upload)
    brandColor: { type: String, default: "#3341a6" },
    taxIds: { type: [labelValue], default: [] },
    bankDetails: { type: [labelValue], default: [] },
    footerText: { type: String, default: "" },
    invoicePrefix: { type: String, default: "INV-" },
    numberDigits: { type: Number, default: 6, min: 1, max: 12 },
    nextNumber: { type: Number, default: 1, min: 1 },
    defaultCurrency: { type: String, default: "USD" },
    defaultTermsDays: { type: Number, default: 14, min: 0 },
    defaultNotes: { type: String, default: "Thank you for your business." },
    locale: { type: String, default: "en" },
    invoiceTemplate: { type: String, enum: ["classic", "minimal", "bold", "compact"], default: "classic" },
  },
  { timestamps: true },
);

export type Business = InferSchemaType<typeof businessSchema> & { _id: mongoose.Types.ObjectId };

// In development, hot reloads would otherwise keep a stale model that silently drops new fields.
if (process.env.NODE_ENV !== "production" && mongoose.models.Business) mongoose.deleteModel("Business");

export const BusinessModel: Model<Business> =
  (mongoose.models.Business as Model<Business>) ?? mongoose.model<Business>("Business", businessSchema);
