"use client";

import { createElement } from "react";
import { pdf } from "@react-pdf/renderer";
import { registerFonts } from "./fonts";
import { InvoicePdf } from "./index";
import type { TemplateId } from "./registry";
import type { DocBusiness, DocInvoice } from "./types";

/** Renders an invoice PDF in the browser. Loaded on demand so react-pdf stays out of the main bundle. */
export async function renderInvoiceBlob(business: DocBusiness, invoice: DocInvoice, template: TemplateId) {
  registerFonts("/fonts");
  // InvoicePdf returns a <Document>; pdf() only checks the element type at runtime.
  const element = createElement(InvoicePdf, { business, invoice, template }) as unknown as Parameters<typeof pdf>[0];
  return pdf(element).toBlob();
}

export function pdfFileName(invoice: DocInvoice) {
  const client = invoice.client.name.normalize("NFKD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
  return `${invoice.number || "invoice"}${client ? `_${client}` : ""}.pdf`;
}
