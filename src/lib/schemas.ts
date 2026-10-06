import { z } from "zod";

export const labelValueSchema = z.object({ label: z.string().trim().max(60), value: z.string().trim().max(200) });

/** Parses the JSON hidden input used by label/value editors, dropping empty rows. */
export const labelValueList = z
  .string()
  .default("[]")
  .transform((s, ctx) => {
    try {
      return JSON.parse(s);
    } catch {
      ctx.addIssue({ code: "custom", message: "Invalid list" });
      return z.NEVER;
    }
  })
  .pipe(z.array(labelValueSchema).max(20))
  .transform((rows) => rows.filter((r) => r.label || r.value));

const optional = (max: number) => z.string().trim().max(max).default("");

export const businessSchema = z.object({
  name: z.string().trim().min(2, "Enter your business name").max(80),
  legalForm: optional(80),
  ownerName: optional(80),
  ownerTitle: optional(80),
  address: optional(300),
  country: z.string().length(2, "Choose a country"),
  email: z.union([z.literal(""), z.email("Enter a valid email address")]).default(""),
  phone: optional(40),
  website: optional(120),
  logo: z
    .string()
    .default("")
    .refine((s) => s === "" || /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(s), "The logo must be a PNG image")
    .refine((s) => s.length < 700_000, "The logo is too large. Use an image under 500 KB."),
  brandColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Pick a colour").default("#3341a6"),
  taxIds: labelValueList,
  bankDetails: labelValueList,
  footerText: optional(200),
  invoicePrefix: z.string().trim().max(12).default("INV-"),
  numberDigits: z.coerce.number().int().min(1).max(12).default(6),
  nextNumber: z.coerce.number().int().min(1, "Next number must be at least 1"),
  defaultCurrency: z.string().length(3),
  defaultTermsDays: z.coerce.number().int().min(0).max(365),
  defaultNotes: optional(500),
});

export const clientSchema = z
  .object({
    name: z.string().trim().min(1, "Enter the client's company or name").max(120),
    email: z.union([z.literal(""), z.email("Enter a valid email address")]).default(""),
    address: optional(400),
    country: z.string().max(2).default(""),
    ids: labelValueList,
    currency: z.string().length(3),
    taxMode: z.enum(["reverse_charge", "none", "rate"]),
    taxRate: z.coerce.number().min(0).max(100).default(0),
    taxLabel: z.string().trim().max(20).default("VAT"),
    noteTitle: optional(160),
    noteBody: optional(800),
    notes: optional(1000),
  })
  .transform((c) => ({ ...c, taxRate: c.taxMode === "rate" ? c.taxRate : 0 }));

export type ClientInput = z.infer<typeof clientSchema>;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date");

export const lineItemSchema = z.object({
  title: z.string().trim().min(1, "Give each line item a title").max(200),
  ref: z.string().trim().max(200).default(""),
  bullets: z.array(z.string().trim().max(300)).max(20).default([]).transform((b) => b.filter(Boolean)),
  qty: z.coerce.number().min(0, "Quantity can't be negative").max(1_000_000),
  price: z.coerce.number().min(-1_000_000_000).max(1_000_000_000),
});

export const invoiceSchema = z.object({
  clientId: z.string().default(""),
  client: z.object({
    name: z.string().trim().min(1, "Choose or enter a client").max(120),
    address: z.string().trim().max(400).default(""),
    country: z.string().max(2).default(""),
    ids: z.array(labelValueSchema).max(20).default([]).transform((r) => r.filter((x) => x.label || x.value)),
  }),
  number: z.string().trim().max(40).default(""),
  issueDate: isoDate,
  termsDays: z.coerce.number().int().min(0).max(365),
  currency: z.string().length(3),
  project: z.string().trim().max(160).default(""),
  serviceType: z.string().trim().max(120).default(""),
  serviceFrom: z.union([z.literal(""), isoDate]).default(""),
  serviceTo: z.union([z.literal(""), isoDate]).default(""),
  serviceOngoing: z.boolean().default(false),
  items: z.array(lineItemSchema).min(1, "Add at least one line item").max(100),
  taxMode: z.enum(["reverse_charge", "none", "rate"]),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  taxLabel: z.string().trim().max(20).default("VAT"),
  noteTitle: z.string().trim().max(160).default(""),
  noteBody: z.string().trim().max(800).default(""),
  notes: z.string().trim().max(1000).default(""),
  paymentReference: z.string().trim().max(80).default(""),
});

export type InvoiceInput = z.input<typeof invoiceSchema>;
