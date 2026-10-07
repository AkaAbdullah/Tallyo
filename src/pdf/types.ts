import type { LineItem } from "@/lib/money";

type Row = { label: string; value: string };

/** The workspace details printed on an invoice. */
export type DocBusiness = {
  name: string; legalForm: string; ownerName: string; ownerTitle: string; address: string; email: string; phone: string;
  website: string; logo: string; brandColor: string; taxIds: Row[]; bankDetails: Row[]; footerText: string;
};

/** One invoice as printed. Works for saved invoices and for unsaved editor state. */
export type DocInvoice = {
  number: string; status?: string; issueDate: string; termsDays: number; dueDate: string; currency: string;
  client: { name: string; address: string; ids: Row[] };
  project: string; serviceType: string; serviceFrom: string; serviceTo: string; serviceOngoing: boolean;
  items: LineItem[]; taxMode: "reverse_charge" | "none" | "rate"; taxRate: number; taxLabel: string;
  noteTitle: string; noteBody: string; notes: string; paymentReference: string; amountPaid?: number; paidAt?: string;
};
