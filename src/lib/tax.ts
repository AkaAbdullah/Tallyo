// Tax treatment presets shared by the client form, invoices and (later) the AI tax helper.
// These are common defaults, not legal advice; users can edit every note.

export type TaxMode = "reverse_charge" | "none" | "rate";

export const TAX_MODES: { value: TaxMode; label: string; hint: string }[] = [
  { value: "rate", label: "Charge tax", hint: "Add VAT, GST or sales tax at a percentage." },
  { value: "reverse_charge", label: "Reverse charge", hint: "0% for business clients in another EU country. The client accounts for VAT." },
  { value: "none", label: "No tax", hint: "0%, for example services exported to a client abroad." },
];

export const EU_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT",
  "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
]);

export type TaxSettings = { taxMode: TaxMode; taxRate: number; taxLabel: string; noteTitle: string; noteBody: string };

const REVERSE_CHARGE_TITLE = "Reverse charge – VAT payable by the recipient.";

export function notePreset(mode: TaxMode, clientCountry?: string): Pick<TaxSettings, "noteTitle" | "noteBody"> {
  if (mode === "reverse_charge") {
    return {
      noteTitle: REVERSE_CHARGE_TITLE,
      noteBody:
        clientCountry === "DE"
          ? "Steuerschuldnerschaft des Leistungsempfängers (§ 13b UStG / Art. 196 Directive 2006/112/EC). No German VAT is charged on this invoice."
          : "VAT is accounted for by the recipient under the reverse-charge procedure (Art. 196 Directive 2006/112/EC).",
    };
  }
  if (mode === "none") {
    return {
      noteTitle: "Export of services – no VAT or sales tax charged.",
      noteBody: "Services supplied to a business customer abroad. No VAT or sales tax is charged on this invoice.",
    };
  }
  return { noteTitle: "", noteBody: "" };
}

/** A sensible starting point based on where the seller and the client are. */
export function suggestTax(sellerCountry: string | undefined, clientCountry: string | undefined): TaxSettings {
  let taxMode: TaxMode = "none";
  if (clientCountry && sellerCountry === clientCountry) taxMode = "rate";
  else if (clientCountry && EU_COUNTRIES.has(clientCountry)) taxMode = "reverse_charge";
  return { taxMode, taxRate: 0, taxLabel: "VAT", ...notePreset(taxMode, clientCountry) };
}
