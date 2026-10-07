import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Tallyo: free, open-source invoice software for freelancers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#1e2026";

/** Share card: headline on the left, an invoice with its carbon copies on the right. */
export default async function Image() {
  const [semibold, regular, logo] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/Inter-600.ttf")),
    readFile(join(process.cwd(), "public/fonts/Inter-400.ttf")),
    readFile(join(process.cwd(), "public/logo.png")),
  ]);
  const rows = [["Website design and build", "€2,400.00"], ["Savings calculator", "€900.00"], ["Localization", "€350.00"]];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", fontFamily: "Inter", color: INK, padding: 72 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 560 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- rendered to PNG by next/og */}
            <img src={`data:image/png;base64,${logo.toString("base64")}`} width={64} height={64} />
            <span style={{ fontSize: 40, fontWeight: 600 }}>Tallyo</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2 }}>Proper invoices for independent work.</span>
            <span style={{ fontSize: 28, color: "#5d6270", marginTop: 24, lineHeight: 1.35 }}>Free, open-source invoice software with PDF templates, tax notes and optional AI.</span>
          </div>
        </div>
        <div style={{ display: "flex", position: "relative", marginLeft: 64, width: 420, height: 486 }}>
          <div style={{ position: "absolute", top: 30, left: 28, width: 400, height: 470, background: "#f6cfd8", borderRadius: 4, transform: "rotate(3deg)" }} />
          <div style={{ position: "absolute", top: 15, left: 14, width: 400, height: 470, background: "#fcefa4", borderRadius: 4, transform: "rotate(1.5deg)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, width: 400, height: 470, background: "#ffffff", borderRadius: 4, border: "1px solid #dadde4", boxShadow: "0 12px 32px rgba(30,32,38,0.18)", display: "flex", flexDirection: "column", padding: 30, fontSize: 17 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600, fontSize: 20 }}>Hollis &amp; Reed</span>
              <span style={{ fontSize: 26, color: "#6b7079" }}>Invoice</span>
            </div>
            <span style={{ color: "#6b7079", marginTop: 4 }}>Billed to Waldblick Energie GmbH</span>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 26, borderTop: "1px solid #e3e6ea" }}>
              {rows.map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #e3e6ea" }}>
                  <span>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto", background: "#3341a6", color: "#ffffff", borderRadius: 4, padding: "14px 16px", fontWeight: 600, fontSize: 20 }}>
              <span>Balance due</span>
              <span>€3,650.00</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: regular, style: "normal", weight: 400 },
        { name: "Inter", data: semibold, style: "normal", weight: 600 },
      ],
    },
  );
}
