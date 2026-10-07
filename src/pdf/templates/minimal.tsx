import { Page, Text, View } from "@react-pdf/renderer";
import type { Prepared } from "../prepare";
import { Bullets, Footer, KeyValues, Logo } from "./shared";

const INK = "#111214";
const SOFT = "#74777f";
const HAIR = "#d9dade";
const label = { fontSize: 7, color: SOFT, marginBottom: 4 } as const;

/** Black and white, large serif heading, hairlines instead of boxes. Brand colour only on the amount due. */
export function Minimal({ p }: { p: Prepared }) {
  const { b, inv, t } = p;
  return (
    <Page size="A4" style={{ fontFamily: "Inter", fontSize: 8, color: INK, paddingTop: 40, paddingHorizontal: 54, paddingBottom: 56 }}>
      {/* lineHeight is resolved against this fontSize and inherited as an absolute value */}
      <View style={{ fontSize: 8, lineHeight: 1.5 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View>
          <Logo src={b.logo} height={24} style={{ marginBottom: 8 }} />
          <Text style={{ fontSize: 10, lineHeight: 1.3, fontWeight: 600 }}>{b.name}</Text>
          {p.contact ? <Text style={{ color: SOFT }}>{p.contact}</Text> : null}
          {p.website ? <Text style={{ color: SOFT }}>{p.website}</Text> : null}
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontFamily: "Instrument Serif", fontSize: 46, lineHeight: 1, letterSpacing: -0.5 }}>Invoice</Text>
          <Text style={{ color: SOFT, marginTop: 4 }}>{p.number}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", marginTop: 24, paddingTop: 11, borderTopWidth: 0.5, borderTopColor: INK }}>
        <View style={{ flex: 1.6, paddingRight: 14 }}>
          <Text style={label}>Billed to</Text>
          <Text style={{ fontWeight: 600 }}>{inv.client.name}</Text>
          {inv.client.address ? <Text>{inv.client.address}</Text> : null}
          <KeyValues rows={p.clientIds} labelStyle={{ color: SOFT }} valueStyle={{ fontWeight: 400 }} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={label}>Issued</Text>
          <Text>{p.issueDate}</Text>
          <Text style={[label, { marginTop: 8 }]}>Due</Text>
          <Text>{p.dueDate}</Text>
        </View>
        <View style={{ flex: 1.2, alignItems: "flex-end" }}>
          <Text style={label}>Amount due</Text>
          <Text style={{ fontSize: 20, lineHeight: 1.15, fontWeight: 600, color: p.brand }}>{p.money(Math.max(t.balance, 0))}</Text>
          <Text style={{ color: SOFT, marginTop: 2 }}>{p.stamp === "VOID" ? "Void" : p.dueLine}</Text>
        </View>
      </View>

      {p.strip.length > 0 && (
        <View style={{ flexDirection: "row", marginTop: 14 }}>
          {p.strip.map(([k, v]) => (
            <View key={k} style={{ flex: 1, paddingRight: 12 }}>
              <Text style={label}>{k}</Text>
              <Text>{v}</Text>
            </View>
          ))}
        </View>
      )}

      <View fixed style={{ flexDirection: "row", marginTop: 18, paddingBottom: 6, borderBottomWidth: 0.5, borderBottomColor: INK, fontSize: 7, color: SOFT }}>
        <Text style={{ flex: 1 }}>Description</Text>
        {p.showQty ? <Text style={{ width: 40, textAlign: "right" }}>Qty</Text> : null}
        <Text style={{ width: 80, textAlign: "right" }}>Price</Text>
        <Text style={{ width: 80, textAlign: "right" }}>Amount</Text>
      </View>
      {p.items.map((item, i) => (
        <View key={i} wrap={false} style={{ flexDirection: "row", paddingVertical: 7, borderBottomWidth: 0.5, borderBottomColor: HAIR }}>
          <View style={{ flex: 1, paddingRight: 14 }}>
            <Text style={{ fontWeight: 600 }}>{item.title}</Text>
            <View style={{ color: SOFT, fontSize: 7.4 }}>
              {item.ref ? <Text>{item.ref}</Text> : null}
              <Bullets items={item.bullets} />
            </View>
          </View>
          {p.showQty ? <Text style={{ width: 40, textAlign: "right" }}>{item.qtyText}</Text> : null}
          <Text style={{ width: 80, textAlign: "right" }}>{item.priceText}</Text>
          <Text style={{ width: 80, textAlign: "right" }}>{item.amountText}</Text>
        </View>
      ))}

      <View wrap={false} style={{ alignSelf: "flex-end", width: 220, marginTop: 12 }}>
        {[["Subtotal", p.money(t.subtotal)], [p.taxLine, p.money(t.taxAmount)], ["Total", p.money(t.total)], ...(t.paid ? [["Paid", `− ${p.money(t.paid)}`]] : [])].map(([k, v]) => (
          <View key={k} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 2.5 }}>
            <Text style={{ color: SOFT }}>{k}</Text><Text>{v}</Text>
          </View>
        ))}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 6, paddingTop: 8, borderTopWidth: 0.5, borderTopColor: INK }}>
          <Text style={{ fontWeight: 600 }}>Balance due</Text>
          <Text style={{ fontFamily: "Instrument Serif", fontSize: 24, lineHeight: 1 }}>{p.money(t.balance)}</Text>
        </View>
      </View>

      {p.hasNote && (
        <View wrap={false} style={{ marginTop: 14, maxWidth: 380 }}>
          {inv.noteTitle ? <Text style={{ fontWeight: 600 }}>{inv.noteTitle}</Text> : null}
          {inv.noteBody ? <Text style={{ color: SOFT, marginTop: 2 }}>{inv.noteBody}</Text> : null}
        </View>
      )}

      <View wrap={false} style={{ flexDirection: "row", marginTop: 16, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: HAIR }}>
        <View style={{ flex: 1, paddingRight: 18 }}>
          <Text style={label}>From</Text>
          <Text style={{ fontWeight: 600 }}>{b.name}</Text>
          {p.owner ? <Text>{p.owner}</Text> : null}
          {b.address ? <Text>{b.address}</Text> : null}
          <KeyValues rows={p.taxIds} labelStyle={{ color: SOFT }} valueStyle={{ fontWeight: 400 }} />
        </View>
        <View style={{ flex: 1, paddingRight: 18 }}>
          {p.bank.length > 0 && (
            <>
              <Text style={label}>Payment details</Text>
              <KeyValues rows={p.bank} labelWidth={66} labelStyle={{ color: SOFT }} valueStyle={{ fontWeight: 400 }} style={{ marginTop: 0 }} />
            </>
          )}
        </View>
        {inv.notes ? (
          <View style={{ flex: 0.8 }}>
            <Text style={label}>Notes</Text>
            <Text>{inv.notes}</Text>
          </View>
        ) : null}
      </View>

      </View>

      <Footer p={p} color={SOFT} style={{ left: 54, width: 487, borderTopColor: HAIR }} />
    </Page>
  );
}
