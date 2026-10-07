import { Document } from "@react-pdf/renderer";
import { prepare } from "./prepare";
import { Bold } from "./templates/bold";
import { Classic } from "./templates/classic";
import { Compact } from "./templates/compact";
import { Minimal } from "./templates/minimal";
import type { DocBusiness, DocInvoice } from "./types";
import { TEMPLATES, type TemplateId } from "./registry";

const COMPONENTS: Record<TemplateId, typeof Classic> = {
  classic: Classic,
  minimal: Minimal,
  bold: Bold,
  compact: Compact,
};

export function InvoicePdf({ business, invoice, template }: { business: DocBusiness; invoice: DocInvoice; template: TemplateId }) {
  const Template = COMPONENTS[template] ?? Classic;
  const title = `${invoice.number || "Invoice"} – ${business.name}`;
  return (
    <Document title={title} author={business.name} subject={`Invoice for ${invoice.client.name}`} creator="Tallyo" producer="Tallyo">
      <Template p={prepare(business, invoice)} />
    </Document>
  );
}

export { TEMPLATES };
export type { TemplateId, DocBusiness, DocInvoice };
