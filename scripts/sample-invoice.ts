// Fictional sample data used for template thumbnails and visual checks.
import type { DocBusiness, DocInvoice } from "../src/pdf/types";

export const sampleBusiness: DocBusiness = {
  name: "Hollis & Reed", legalForm: "Ltd", ownerName: "Maya Hollis", ownerTitle: "Director",
  address: "14 Weaver Street, Manchester M4 6JB, United Kingdom", email: "studio@hollisreed.co", phone: "+44 161 555 0142",
  website: "https://hollisreed.co", logo: "", brandColor: "#3341a6",
  taxIds: [{ label: "Company no.", value: "13723923" }, { label: "VAT ID", value: "GB409738961" }],
  bankDetails: [{ label: "Account name", value: "Hollis & Reed Ltd" }, { label: "Bank", value: "Monzo Business" }, { label: "IBAN", value: "GB33 MONZ 0400 0012 3456 78" }, { label: "SWIFT / BIC", value: "MONZGB2L" }],
  footerText: "Hollis & Reed Ltd · Registered in England and Wales no. 13723923",
};

export const sampleInvoice: DocInvoice = {
  number: "INV-000142", status: "sent", issueDate: "2026-10-31", termsDays: 14, dueDate: "2026-11-14", currency: "EUR",
  client: { name: "Waldblick Energie GmbH", address: "Musterstraße 1\n10115 Berlin\nDeutschland", ids: [{ label: "VAT ID", value: "DE123456789" }] },
  project: "Website and savings calculator", serviceType: "Design and development", serviceFrom: "2026-09-01", serviceTo: "2026-10-31", serviceOngoing: false,
  items: [
    { title: "Website design and build", ref: "Ref. quote Q-2026-031", bullets: ["12 pages with CMS-driven product catalogue", "Responsive build for all devices", "Cross-browser testing and launch support"], qty: 1, price: 2400 },
    { title: "Energy savings calculator", ref: "", bullets: ["Embedded web app with lead form", "CO₂ and payback estimates"], qty: 1, price: 900 },
    { title: "German and French localization", ref: "", bullets: ["Copy, CMS fields and calculator"], qty: 1, price: 350 },
  ],
  taxMode: "reverse_charge", taxRate: 0, taxLabel: "VAT",
  noteTitle: "Reverse charge – VAT payable by the recipient.",
  noteBody: "VAT is accounted for by the recipient under the reverse-charge procedure (Art. 196 Directive 2006/112/EC).",
  notes: "Thank you for your business.", paymentReference: "", amountPaid: 0,
};
