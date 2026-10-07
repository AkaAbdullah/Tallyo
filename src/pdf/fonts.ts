import { Font } from "@react-pdf/renderer";

let registered = false;

/**
 * Registers the bundled fonts. `base` is "/fonts" in the browser, or a filesystem path when rendering in Node.
 * Inter covers Latin, Greek, Cyrillic and currency symbols such as € ₹ ₨; the PDF base fonts do not.
 */
export function registerFonts(base = "/fonts") {
  if (registered) return;
  registered = true;
  Font.register({
    family: "Inter",
    fonts: [300, 400, 500, 600, 700].map((w) => ({ src: `${base}/Inter-${w}.ttf`, fontWeight: w })),
  });
  Font.register({ family: "Instrument Serif", src: `${base}/InstrumentSerif-400.ttf` });
  // Never hyphenate names, numbers or IBANs.
  Font.registerHyphenationCallback((word) => [word]);
}
