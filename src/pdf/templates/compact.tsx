import { Page, Text, View } from "@react-pdf/renderer";
import type { Prepared } from "../prepare";
import { Footer, INK, KeyValues, Logo, MUTED, RULE } from "./shared";

const label = { fontSize: 6.2, fontWeight: 600, color: MUTED, marginBottom: 2 } as const;
const cell = { paddingVertical: 4, paddingHorizontal: 5 } as const;

/** Dense, table-first. Details sit in one bordered band, and item details run inline to save space. */
export function Compact({ p }: { p: Prepared }) {
  const { b, inv, t } = p;
  return (
    <Page size="A4" style={{ fontFamily: "Inter", fontSize: 7.2, color: INK, paddingTop: 28, paddingHorizontal: 36, paddingBottom: 50 }}>
      {/* lineHeight is resolved against this fontSize and inherited as an absolute value */}
      <View style={{ fontSize: 7.2, lineHeight: 1.38 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 8, borderBottomWidth: 1.5, borderBottomColor: p.brand }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Logo src={b.logo} height={22} style={{ marginRight: 8 }} />
          <View>
            <Text style={{ fontSize: 10, lineHeight: 1.25, fontWeight: 700 }}>{b.name}</Text>
            <Text style={{ color: MUTED }}>{[p.contact, p.website].filter(Boolean).join("  ·  ")}</Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 13, lineHeight: 1.2, fontWeight: 700 }}>Invoice {p.number}</Text>
          {p.stamp ? <Text style={{ fontSize: 6.5, fontWeight: 700, color: p.stamp === "PAID" ? "#0b7a3e" : "#a3261b" }}>{p.stamp}</Text> : null}
        </View>
      </View>

      <View style={{ flexDirection: "row", borderBottomWidth: 0.6, borderBottomColor: RULE }}>
        {[
          ["Bill to", <View key="c"><Text style={{ fontWeight: 700 }}>{inv.client.name}</Text>{inv.client.address ? <Text>{inv.client.address}</Text> : null}<KeyValues rows={p.clientIds} labelWidth={44} style={{ marginTop: 2 }} /></View>],
          ["From", <View key="f"><Text style={{ fontWeight: 700 }}>{b.name}</Text>{p.owner ? <Text>{p.owner}</Text> : null}{b.address ? <Text>{b.address}</Text> : null}<KeyValues rows={p.taxIds} labelWidth={52} style={{ marginTop: 2 }} /></View>],
          ["Details", <KeyValues key="d" rows={[{ label: "Issued", value: p.issueDate }, { label: "Due", value: p.dueDate }, { label: "Terms", value: p.terms }, { label: "Currency", value: p.cur }, ...p.strip.map(([k, v]) => ({ label: k === "Service period" ? "Period" : k === "Service type" ? "Service" : k, value: v }))]} labelWidth={42} style={{ marginTop: 0 }} />],
        ].map(([k, content], i) => (
          <View key={String(k)} style={{ flex: i === 2 ? 1.25 : 1, paddingVertical: 8, paddingHorizontal: 6, borderLeftWidth: i ? 0.6 : 0, borderLeftColor: RULE }}>
            <Text style={label}>{k}</Text>
            {content}
          </View>
        ))}
      </View>

      <View fixed style={{ flexDirection: "row", marginTop: 10, backgroundColor: INK, color: "#ffffff", fontSize: 6.5, fontWeight: 600 }}>
        <Text style={[cell, { width: 18 }]}>#</Text>
        <Text style={[cell, { flex: 1 }]}>Description</Text>
        <Text style={[cell, { width: 34, textAlign: "right" }]}>Qty</Text>
        <Text style={[cell, { width: 70, textAlign: "right" }]}>Unit price</Text>
        <Text style={[cell, { width: 74, textAlign: "right" }]}>Amount</Text>
      </View>
      {p.items.map((item, i) => (
        <View key={i} wrap={false} style={{ flexDirection: "row", backgroundColor: i % 2 ? "#f6f7f9" : "#ffffff", borderBottomWidth: 0.4, borderBottomColor: RULE }}>
          <Text style={[cell, { width: 18, color: MUTED }]}>{i + 1}</Text>
          <View style={[cell, { flex: 1 }]}>
            <Text style={{ fontWeight: 600 }}>{item.title}{item.ref ? <Text style={{ fontWeight: 400, color: MUTED }}>{`  ${item.ref}`}</Text> : null}</Text>
            {item.bullets.length > 0 && <Text style={{ color: MUTED, fontSize: 6.6 }}>{item.bullets.join("; ")}</Text>}
          </View>
          <Text style={[cell, { width: 34, textAlign: "right" }]}>{item.qtyText}</Text>
          <Text style={[cell, { width: 70, textAlign: "right" }]}>{item.priceText}</Text>
          <Text style={[cell, { width: 74, textAlign: "right", fontWeight: 600 }]}>{item.amountText}</Text>
        </View>
      ))}

      <View wrap={false} style={{ flexDirection: "row", marginTop: 8 }}>
        <View style={{ flex: 1, paddingRight: 16 }}>
          {p.hasNote && (
            <View style={{ backgroundColor: "#f6f7f9", padding: 6, marginBottom: 6 }}>
              {inv.noteTitle ? <Text style={{ fontWeight: 700 }}>{inv.noteTitle}</Text> : null}
              {inv.noteBody ? <Text style={{ color: MUTED, fontSize: 6.6 }}>{inv.noteBody}</Text> : null}
            </View>
          )}
          {p.bank.length > 0 && (
            <>
              <Text style={label}>Payment details</Text>
              <KeyValues rows={p.bank} labelWidth={58} valueStyle={{ fontWeight: 600 }} style={{ marginTop: 0 }} />
            </>
          )}
          {inv.notes ? <Text style={{ marginTop: 6, color: MUTED }}>{inv.notes}</Text> : null}
        </View>
        <View style={{ width: 196 }}>
          {[["Subtotal", p.money(t.subtotal)], [p.taxLine, p.money(t.taxAmount)], ["Total", p.money(t.total)], ["Amount paid", p.money(t.paid)]].map(([k, v]) => (
            <View key={k} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 1.8, paddingHorizontal: 5, fontWeight: k === "Total" ? 700 : 400, color: k === "Total" ? INK : MUTED }}>
              <Text>{k}</Text><Text>{v}</Text>
            </View>
          ))}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3, paddingVertical: 5, paddingHorizontal: 5, borderTopWidth: 1.5, borderTopColor: p.brand, fontSize: 9, lineHeight: 1.3, fontWeight: 700 }}>
            <Text>Balance due ({p.cur})</Text><Text style={{ color: p.brand }}>{p.money(t.balance)}</Text>
          </View>
          <Text style={{ textAlign: "right", color: MUTED, paddingHorizontal: 5 }}>{p.dueLine}</Text>
        </View>
      </View>

      </View>

      <Footer p={p} style={{ left: 36, width: 523 }} />
    </Page>
  );
}
