// Renders every template with sample data: `pnpm templates:render [outDir] [data.json]`.
// Bundled with esbuild first so react-pdf's ESM-only dependencies load correctly.
// Writes <outDir>/<id>.pdf. Used for thumbnails and visual checks.
import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToFile } from "@react-pdf/renderer";
import { registerFonts } from "../src/pdf/fonts";
import { InvoicePdf, TEMPLATES } from "../src/pdf/index";
import { sampleBusiness, sampleInvoice } from "./sample-invoice";

const outDir = path.resolve(process.argv[2] ?? "public/templates");
const data = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], "utf8")) : { business: sampleBusiness, invoice: sampleInvoice };
const only = process.env.TEMPLATE;

registerFonts(path.resolve("public/fonts"));
fs.mkdirSync(outDir, { recursive: true });
async function main() {
  for (const t of TEMPLATES) {
    if (only && t.id !== only) continue;
    const file = path.join(outDir, `${t.id}.pdf`);
    // InvoicePdf returns a <Document>; renderToFile only checks the element type at runtime.
    const element = createElement(InvoicePdf, { business: data.business, invoice: data.invoice, template: t.id }) as unknown as Parameters<typeof renderToFile>[0];
    await renderToFile(element, file);
    console.log("wrote", file);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
