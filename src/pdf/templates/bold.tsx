import { Page, Text, View } from "@react-pdf/renderer";
import type { Prepared } from "../prepare";
import { Bullets, Footer, INK, KeyValues, Logo, MUTED, RULE } from "./shared";

const label = { fontSize: 6.8, fontWeight: 600, color: MUTED, marginBottom: 3 } as const;

/** A full-width header band in the brand colour; the rest stays clean so the colour carries the brand. */
export function Bold({ p }: { p: Prepared }) {
  const { b, inv, t } = p;
  return (
    <Page size="A4" style={{ fontFamily: "Inter", fontSize: 8, color: INK, paddingTop: 34, paddingBottom: 58 }}>
      {/* lineHeight is resolved against this fontSize and inherited as an absolute value */}
      <View style={{ fontSize: 8, lineHeight: 1.45 }}>
      <View style={{ marginTop: -34, backgroundColor: p.brand, color: "#ffffff", paddingTop: 34, paddingBottom: 26, paddingHorizontal: 43, flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ maxWidth: "55%" }}>
          {b.logo ? (
            <View style={{ backgroundColor: "#ffffff", borderRadius: 5, padding: 6, alignSelf: "flex-start", marginBottom: 10 }}>
              <Logo src={b.logo} height={24} />
            </View>
          ) : null}
          <Text style={{ fontSize: 13, lineHeight: 1.25, fontWeight: 700 }}>{b.name}</Text>
          {b.legalForm ? <Text style={{ opacity: 0.8 }}>{b.legalForm}</Text> : null}
          {p.contact ? <Text style={{ opacity: 0.8, marginTop: 4 }}>{p.contact}</Text> : null}
          {p.website ? <Text style={{ opacity: 0.8 }}>{p.website}</Text> : null}
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 28, lineHeight: 1.05, fontWeight: 700, letterSpacing: -0.5 }}>Invoice</Text>
          <Text style={{ opacity: 0.85, marginTop: 2 }}>{p.number}</Text>
          <Text style={{ opacity: 0.75, marginTop: 14, fontSize: 7 }}>Amount due ({p.cur})</Text>
          <Text style={{ fontSize: 20, lineHeight: 1.15, fontWeight: 700 }}>{p.money(Math.max(t.balance, 0))}</Text>
          {p.stamp ? <Text style={{ marginTop: 3, fontSize: 7, fontWeight: 700, letterSpacing: 1 }}>{p.stamp}</Text> : null}
        </View>
      </View>

      <View style={{ paddingHorizontal: 43 }}>
        <View style={{ flexDirection: "row", borderBottomWidth: 0.75, borderBottomColor: RULE, paddingVertical: 12 }}>
          {[["Invoice date", p.issueDate], ["Due date", p.dueDate], ["Terms", p.terms], ["Currency", p.cur]].map(([k, v]) => (
            <View key={k} style={{ flex: 1 }}>
              <Text style={label}>{k}</Text>
              <Text style={{ fontWeight: 600 }}>{v}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row", paddingVertical: 14 }}>
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text style={label}>Bill to</Text>
            <Text style={{ fontSize: 9, fontWeight: 700 }}>{inv.client.name}</Text>
            {inv.client.address ? <Text>{inv.client.address}</Text> : null}
            <KeyValues rows={p.clientIds} />
          </View>
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text style={label}>From</Text>
            <Text style={{ fontSize: 9, fontWeight: 700 }}>{b.name}</Text>
            {p.owner ? <Text>{p.owner}</Text> : null}
            {b.address ? <Text>{b.address}</Text> : null}
            <KeyValues rows={p.taxIds} />
          </View>
          {p.strip.length > 0 && (
            <View style={{ flex: 1 }}>
              {p.strip.map(([k, v]) => (
                <View key={k} style={{ marginBottom: 5 }}>
                  <Text style={label}>{k}</Text>
                  <Text style={{ fontWeight: 600 }}>{v}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View fixed style={{ flexDirection: "row", paddingVertical: 6, borderBottomWidth: 1.5, borderBottomColor: p.brand, fontSize: 7, fontWeight: 700, color: p.brand }}>
          <Text style={{ flex: 1 }}>Description</Text>
          {p.showQty ? <Text style={{ width: 40, textAlign: "right" }}>Qty</Text> : null}
          <Text style={{ width: 80, textAlign: "right" }}>Unit price</Text>
          <Text style={{ width: 80, textAlign: "right" }}>Amount</Text>
        </View>
        {p.items.map((item, i) => (
          <View key={i} wrap={false} style={{ flexDirection: "row", paddingVertical: 7, borderBottomWidth: 0.75, borderBottomColor: RULE }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ fontWeight: 700 }}>{item.title}</Text>
              <View style={{ fontSize: 7.3, color: MUTED }}>
                {item.ref ? <Text>{item.ref}</Text> : null}
                <Bullets items={item.bullets} />
              </View>
            </View>
            {p.showQty ? <Text style={{ width: 40, textAlign: "right" }}>{item.qtyText}</Text> : null}
            <Text style={{ width: 80, textAlign: "right" }}>{item.priceText}</Text>
            <Text style={{ width: 80, textAlign: "right", fontWeight: 600 }}>{item.amountText}</Text>
          </View>
        ))}

        <View wrap={false} style={{ flexDirection: "row", marginTop: 12 }}>
          <View style={{ flex: 1, paddingRight: 24 }}>
            {p.hasNote && (
              <View style={{ borderWidth: 0.75, borderColor: p.brand, borderRadius: 5, padding: 9 }}>
                {inv.noteTitle ? <Text style={{ fontWeight: 700, color: p.brand }}>{inv.noteTitle}</Text> : null}
                {inv.noteBody ? <Text style={{ fontSize: 7.4, color: "#3d4247", marginTop: 2 }}>{inv.noteBody}</Text> : null}
              </View>
            )}
          </View>
          <View style={{ width: 210 }}>
            {[["Subtotal", p.money(t.subtotal)], [p.taxLine, p.money(t.taxAmount)], ["Total", p.money(t.total)], ["Amount paid", p.money(t.paid)]].map(([k, v]) => (
              <View key={k} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 2.3, color: k === "Total" ? INK : MUTED, fontWeight: k === "Total" ? 700 : 400 }}>
                <Text>{k}</Text><Text>{v}</Text>
              </View>
            ))}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5, paddingVertical: 8, paddingHorizontal: 9, backgroundColor: p.brand, color: "#ffffff", borderRadius: 4, fontSize: 9.5, lineHeight: 1.3, fontWeight: 700 }}>
              <Text>Balance due</Text><Text>{p.money(t.balance)}</Text>
            </View>
          </View>
        </View>

        <View wrap={false} style={{ flexDirection: "row", marginTop: 16, paddingTop: 12, borderTopWidth: 0.75, borderTopColor: RULE }}>
          <View style={{ flex: 1, paddingRight: 18 }}>
            {p.bank.length > 0 && (
              <>
                <Text style={label}>Payment details</Text>
                <KeyValues rows={p.bank} labelWidth={69} valueStyle={{ fontWeight: 600 }} style={{ marginTop: 0 }} />
              </>
            )}
          </View>
          <View style={{ flex: 1 }}>
            {inv.notes ? (
              <>
                <Text style={label}>Notes</Text>
                <Text>{inv.notes}</Text>
              </>
            ) : null}
          </View>
        </View>
      </View>

      </View>

      <Footer p={p} />
    </Page>
  );
}
