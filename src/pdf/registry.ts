export const TEMPLATES = [
  { id: "classic", name: "Classic", description: "Details at the top right, three columns, a coloured balance." },
  { id: "minimal", name: "Minimal", description: "Black and white, large type, plenty of space." },
  { id: "bold", name: "Bold", description: "A full-width header in your brand colour." },
  { id: "compact", name: "Compact", description: "Dense and table-first. Fits long invoices on one page." },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];

export const isTemplateId = (v: unknown): v is TemplateId => TEMPLATES.some((t) => t.id === v);
