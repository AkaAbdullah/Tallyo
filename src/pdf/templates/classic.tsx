import { Page, Text, View } from "@react-pdf/renderer";
import type { Prepared } from "../prepare";
import { Bullets, Footer, INK, KeyValues, Logo, MUTED, RULE } from "./shared";

const label = { fontSize: 6.8, fontWeight: 600, letterSpacing: 0.4, color: MUTED, marginBottom: 3 } as const;

/** The original Tallyo layout: meta table top right, three columns, totals with a brand-coloured balance. */
export function Classic({ p }: { p: Prepared }) {
  const { b, inv, t } = p;
  return (
    <Page size="A4" style={{ fontFamily: "Inter", fontSize: 7.9, color: INK, paddingTop: 31, paddingHorizontal: 43, paddingBottom: 56 }}>
      {/* lineHeight is resolved against this fontSize and inherited as an absolute value */}
      <View style={{ fontSize: 7.9, lineHeight: 1.45 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ maxWidth: "55%" }}>
          <Logo src={b.logo} style={{ marginBottom: 7 }} />
          <Text style={{ fontSize: 11.3, lineHeight: 1.3, fontWeight: 700 }}>{b.name}</Text>
          {b.legalForm ? <Text style={{ fontSize: 7.5, color: MUTED, marginBottom: 3 }}>({b.legalForm})</Text> : null}
          {p.contact ? <Text style={{ color: MUTED }}>{p.contact}</Text> : null}
          {p.website ? <Text style={{ color: MUTED }}>{p.website}</Text> : null}
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 22.5, lineHeight: 1.1, fontWeight: 300, letterSpacing: 1, color: MUTED, marginBottom: 10 }}>INVOICE</Text>
          {[["Invoice number", p.number], ["Invoice date", p.issueDate], ["Payment terms", p.terms], ["Due date", p.dueDate], ["Currency", p.cur]].map(([k, v]) => (
            <View key={k} style={{ flexDirection: "row", marginBottom: 1.5 }}>
              <Text style={{ color: MUTED, width: 80, textAlign: "right", marginRight: 13 }}>{k}</Text>
              <Text style={{ fontWeight: 600, minWidth: 70, textAlign: "right" }}>{v}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ flexDirection: "row", height: 2.3, marginVertical: 10.5, borderRadius: 1 }}>
        <View style={{ width: "30%", backgroundColor: INK }} />
        <View style={{ flex: 1, backgroundColor: p.brand }} />
      </View>

      <View style={{ flexDirection: "row", marginBottom: 10.5 }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={label}>FROM</Text>
          <Text style={{ fontSize: 8.6, fontWeight: 700 }}>{b.name}</Text>
          {p.owner ? <Text>{p.owner}</Text> : null}
          {b.address ? <Text>{b.address}</Text> : null}
          <KeyValues rows={p.taxIds} />
        </View>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={label}>BILL TO</Text>
          <Text style={{ fontSize: 8.6, fontWeight: 700 }}>{inv.client.name}</Text>
          {inv.client.address ? <Text>{inv.client.address}</Text> : null}
          <KeyValues rows={p.clientIds} />
        </View>
        <View style={{ width: 142, backgroundColor: "#f5f7fa", borderRadius: 4.5, paddingVertical: 9, paddingHorizontal: 10.5, alignSelf: "flex-start" }}>
          {p.stamp ? (
            <Text style={{ position: "absolute", top: 8, right: 9, fontSize: 6.5, fontWeight: 700, letterSpacing: 1, paddingVertical: 1.5, paddingHorizontal: 4, borderRadius: 2, color: p.stamp === "PAID" ? "#0b7a3e" : "#a3261b", backgroundColor: p.stamp === "PAID" ? "#dff5e8" : "#fde4e1" }}>{p.stamp}</Text>
          ) : null}
          <Text style={label}>AMOUNT DUE ({p.cur})</Text>
          <Text style={{ fontSize: 16.5, lineHeight: 1.2, fontWeight: 700, color: "#0a1f44", marginVertical: 1.5 }}>{p.money(Math.max(t.balance, 0))}</Text>
          <Text style={{ fontSize: 7.5, color: MUTED }}>{p.dueLine}</Text>
        </View>
      </View>

      {p.strip.length > 0 && (
        <View style={{ flexDirection: "row", borderWidth: 0.75, borderColor: RULE, borderRadius: 4.5, marginBottom: 9 }}>
          {p.strip.map(([k, v], i) => (
            <View key={k} style={{ flex: 1, paddingVertical: 6.5, paddingHorizontal: 9, borderLeftWidth: i ? 0.75 : 0, borderLeftColor: RULE }}>
              <Text style={label}>{k.toUpperCase()}</Text>
              <Text style={{ fontWeight: 600 }}>{v}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ flexDirection: "row", backgroundColor: "#f5f7fa", borderBottomWidth: 0.75, borderBottomColor: RULE, paddingVertical: 6, paddingHorizontal: 7.5, fontSize: 6.8, fontWeight: 600, color: MUTED, letterSpacing: 0.4 }} fixed>
        <Text style={{ flex: 1 }}>DESCRIPTION</Text>
        {p.showQty ? <Text style={{ width: 36, textAlign: "right" }}>QTY</Text> : null}
        <Text style={{ width: 80, textAlign: "right" }}>UNIT PRICE</Text>
        <Text style={{ width: 80, textAlign: "right" }}>AMOUNT</Text>
      </View>
      {p.items.map((item, i) => (
        <View key={i} wrap={false} style={{ flexDirection: "row", paddingVertical: 5.5, paddingHorizontal: 7.5, borderBottomWidth: 0.75, borderBottomColor: "#eef0f2" }}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={{ fontSize: 8.3, fontWeight: 700, marginBottom: 1.5 }}>{item.title}</Text>
            <View style={{ fontSize: 7.2, color: MUTED }}>
              {item.ref ? <Text>{item.ref}</Text> : null}
              <Bullets items={item.bullets} />
            </View>
          </View>
          {p.showQty ? <Text style={{ width: 36, textAlign: "right" }}>{item.qtyText}</Text> : null}
          <Text style={{ width: 80, textAlign: "right" }}>{item.priceText}</Text>
          <Text style={{ width: 80, textAlign: "right" }}>{item.amountText}</Text>
        </View>
      ))}

      <View wrap={false} style={{ alignSelf: "flex-end", width: 203, marginTop: 7.5 }}>
        {[["Subtotal", p.money(t.subtotal)], [p.taxLine, p.money(t.taxAmount)]].map(([k, v]) => (
          <View key={k} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 2.3, paddingHorizontal: 7.5, color: MUTED }}>
            <Text>{k}</Text><Text>{v}</Text>
          </View>
        ))}
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 6, paddingBottom: 2.3, paddingHorizontal: 7.5, borderTopWidth: 0.75, borderTopColor: RULE, fontWeight: 700 }}>
          <Text>Total</Text><Text>{p.money(t.total)}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 2.3, paddingHorizontal: 7.5, color: MUTED }}>
          <Text>Amount paid</Text><Text>{p.money(t.paid)}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 7, paddingHorizontal: 7.5, backgroundColor: p.brand, borderRadius: 3.8, color: "#ffffff", fontSize: 9.4, lineHeight: 1.3, fontWeight: 700 }}>
          <Text>Balance due ({p.cur})</Text><Text>{p.money(t.balance)}</Text>
        </View>
      </View>

      {p.hasNote && (
        <View wrap={false} style={{ marginTop: 9, borderLeftWidth: 2.3, borderLeftColor: p.brand, backgroundColor: "#f0f4ff", paddingVertical: 7.5, paddingHorizontal: 9, borderTopRightRadius: 4.5, borderBottomRightRadius: 4.5 }}>
          {inv.noteTitle ? <Text style={{ fontSize: 8.6, fontWeight: 700, color: "#0a1f44" }}>{inv.noteTitle}</Text> : null}
          {inv.noteBody ? <Text style={{ fontSize: 7.4, color: "#3d4247", marginTop: 1.5 }}>{inv.noteBody}</Text> : null}
        </View>
      )}

      <View wrap={false} style={{ flexDirection: "row", marginTop: 9 }}>
        <View style={{ flex: 1, paddingRight: 18 }}>
          {p.bank.length > 0 && (
            <>
              <Text style={label}>PAYMENT DETAILS</Text>
              <KeyValues rows={p.bank} labelWidth={69} valueStyle={{ fontWeight: 600 }} style={{ fontSize: 7.5 }} />
            </>
          )}
        </View>
        <View style={{ flex: 1 }}>
          {inv.notes ? (
            <>
              <Text style={label}>NOTES</Text>
              <Text style={{ fontSize: 7.4, color: "#3d4247" }}>{inv.notes}</Text>
            </>
          ) : null}
        </View>
      </View>

      </View>

      <Footer p={p} />
    </Page>
  );
}
