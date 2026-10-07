import { Image, Text, View } from "@react-pdf/renderer";
import type { Styles } from "@react-pdf/renderer";
import type { Prepared } from "../prepare";

type Style = Styles[string];

export const INK = "#1e2026";
export const MUTED = "#6b7079";
export const RULE = "#e3e6ea";

type Row = { label: string; value: string };

/** Label/value pairs in two aligned columns. */
export function KeyValues({ rows, labelWidth, style, labelStyle, valueStyle }: {
  rows: Row[]; labelWidth?: number; style?: Style; labelStyle?: Style; valueStyle?: Style;
}) {
  if (!rows.length) return null;
  return (
    <View style={[{ marginTop: 4 }, style ?? {}]}>
      {rows.map((r, i) => (
        <View key={i} style={{ flexDirection: "row", marginBottom: 1.5 }}>
          <Text style={[{ color: MUTED, width: labelWidth ?? 62 }, labelStyle ?? {}]}>{r.label}</Text>
          <Text style={[{ flex: 1, fontWeight: 500 }, valueStyle ?? {}]}>{r.value}</Text>
        </View>
      ))}
    </View>
  );
}

export function Logo({ src, height = 30, style }: { src: string; height?: number; style?: Style }) {
  if (!src) return null;
  // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt
  return <Image src={src} style={[{ height, objectFit: "contain", objectPosition: "left", maxWidth: 140 }, style ?? {}]} />;
}

/**
 * Repeats at the bottom of every page. Two react-pdf quirks shape this: a `render` Text disappears when any
 * lineHeight applies to it (templates set lineHeight on a content wrapper, never on <Page>), and a styled
 * row containing a `render` Text is dropped, so the page number is its own fixed Text.
 */
export function Footer({ p, color = "#8a9096", style }: { p: Prepared; color?: string; style?: Style }) {
  const box = { position: "absolute", bottom: 20, left: 43, width: 509, fontSize: 6.5, color } as const;
  return (
    <>
      <View fixed style={[{ ...box, borderTopWidth: 0.75, borderTopColor: RULE, paddingTop: 6, flexDirection: "row", justifyContent: "space-between" }, style ?? {}]}>
        <Text style={{ width: 340 }}>{p.b.footerText}</Text>
        <Text style={{ width: 160, textAlign: "right" }}>{p.website}</Text>
      </View>
      <Text
        fixed
        style={{ ...box, bottom: 9, textAlign: "right", color }}
        render={({ pageNumber, totalPages }) => (totalPages > 1 ? `Page ${pageNumber} of ${totalPages}` : "")}
      />
    </>
  );
}

export function Bullets({ items, style }: { items: string[]; style?: Style }) {
  if (!items.length) return null;
  return (
    <View style={[{ marginTop: 2 }, style ?? {}]}>
      {items.map((x, i) => (
        <View key={i} style={{ flexDirection: "row", marginTop: 1 }}>
          <Text style={{ width: 9 }}>•</Text>
          <Text style={{ flex: 1 }}>{x}</Text>
        </View>
      ))}
    </View>
  );
}
