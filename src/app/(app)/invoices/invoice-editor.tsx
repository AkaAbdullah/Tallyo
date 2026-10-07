"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, LoaderCircle, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AiAssist } from "@/components/forms/ai-assist";
import { Field } from "@/components/forms/field";
import { LabelValueEditor } from "@/components/forms/label-value-editor";
import { PdfPreview } from "@/components/invoice/pdf-preview";
import { NativeSelect } from "@/components/native-select";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addDays, computeTotals, formatDate, formatMoney, lineAmount } from "@/lib/money";
import { notePreset, suggestTax, TAX_MODES, type TaxMode } from "@/lib/tax";
import { TEMPLATES, type TemplateId } from "@/pdf/registry";
import type { DocBusiness } from "@/pdf/types";
import type { ClientDTO, InvoiceDTO } from "@/server/dto";
import { aiDraftItems, aiExtractClient, aiPolishItem } from "@/server/ai";
import { saveInvoice } from "@/server/invoices";

type Option = { code: string; name: string };
type Row = { label: string; value: string };
// Quantities and prices are kept as text while typing ("1.", "") and converted for totals.
type ItemDraft = { title: string; ref: string; bulletsText: string; qty: string; price: string };

export type EditorDefaults = {
  issueDate: string;
  termsDays: number;
  currency: string;
  notes: string;
  nextNumber: string;
};

const blankItem = (): ItemDraft => ({ title: "", ref: "", bulletsText: "", qty: "1", price: "" });
const toItem = (d: ItemDraft) => ({
  title: d.title,
  ref: d.ref,
  bullets: d.bulletsText.split("\n"),
  qty: d.qty === "" ? 0 : Number(d.qty),
  price: d.price === "" ? 0 : Number(d.price),
});

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="border-b border-rule py-6 first:pt-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold">{title}</h2>
        {action}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

export function InvoiceEditor({
  invoice, business, clients, defaults, currencies, preselectClientId, aiEnabled = false,
}: {
  aiEnabled?: boolean;
  invoice?: InvoiceDTO;
  business: DocBusiness & { country: string; invoiceTemplate: TemplateId };
  clients: ClientDTO[];
  defaults: EditorDefaults;
  currencies: Option[];
  preselectClientId?: string;
}) {
  const preselected = clients.find((c) => c.id === preselectClientId);
  const [clientId, setClientId] = useState(invoice?.clientId ?? preselected?.id ?? "");
  const [client, setClient] = useState<{ name: string; address: string; country: string; ids: Row[] }>(
    invoice?.client ?? (preselected ? { name: preselected.name, address: preselected.address, country: preselected.country, ids: preselected.ids } : { name: "", address: "", country: "", ids: [] }),
  );
  // Remounts the IDs editor when a different saved client is picked.
  const [clientVersion, setClientVersion] = useState(0);
  const [number, setNumber] = useState(invoice?.number ?? "");
  const [issueDate, setIssueDate] = useState(invoice?.issueDate ?? defaults.issueDate);
  const [termsDays, setTermsDays] = useState(String(invoice?.termsDays ?? defaults.termsDays));
  const [currency, setCurrency] = useState(invoice?.currency ?? preselected?.currency ?? defaults.currency);
  const [project, setProject] = useState(invoice?.project ?? "");
  const [serviceType, setServiceType] = useState(invoice?.serviceType ?? "Software / web development");
  const [serviceFrom, setServiceFrom] = useState(invoice?.serviceFrom ?? "");
  const [serviceTo, setServiceTo] = useState(invoice?.serviceTo ?? "");
  const [serviceOngoing, setServiceOngoing] = useState(invoice?.serviceOngoing ?? false);
  const [items, setItems] = useState<ItemDraft[]>(
    invoice?.items.map((i) => ({ title: i.title, ref: i.ref, bulletsText: i.bullets.join("\n"), qty: String(i.qty), price: String(i.price) })) ?? [blankItem()],
  );
  const [tax, setTax] = useState<{ taxMode: TaxMode; taxRate: string; taxLabel: string; noteTitle: string; noteBody: string }>(() => {
    const src = invoice ?? preselected;
    return src
      ? { taxMode: src.taxMode, taxRate: String(src.taxRate), taxLabel: src.taxLabel, noteTitle: src.noteTitle, noteBody: src.noteBody }
      : { taxMode: "none", taxRate: "0", taxLabel: "VAT", noteTitle: "", noteBody: "" };
  });
  const [notes, setNotes] = useState(invoice?.notes ?? defaults.notes);
  const [paymentReference, setPaymentReference] = useState(invoice?.paymentReference ?? "");
  const [template, setTemplate] = useState<TemplateId | "">(invoice?.template ?? "");
  const effectiveTemplate = template || business.invoiceTemplate;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  const dueDate = issueDate ? addDays(issueDate, Number(termsDays) || 0) : "";
  const lineItems = useMemo(() => items.map(toItem), [items]);
  const totals = computeTotals(lineItems, { taxMode: tax.taxMode, taxRate: Number(tax.taxRate) || 0 }, invoice?.amountPaid ?? 0);

  function pickClient(id: string) {
    setClientId(id);
    const c = clients.find((x) => x.id === id);
    if (!c) return;
    setClient({ name: c.name, address: c.address, country: c.country, ids: c.ids });
    setClientVersion((v) => v + 1);
    setCurrency(c.currency);
    setTax({ taxMode: c.taxMode, taxRate: String(c.taxRate), taxLabel: c.taxLabel, noteTitle: c.noteTitle, noteBody: c.noteBody });
  }

  async function fillClientFromMessage(message: string) {
    const res = await aiExtractClient(message);
    if (!res.ok) return res.error;
    const c = res.data;
    if (!c.name && !c.address && !c.ids.length) return "No billing details found in that text.";
    setClientId("");
    setClient({ name: c.name, address: c.address, country: c.country, ids: c.ids });
    setClientVersion((v) => v + 1);
    if (c.currency && currencies.some((x) => x.code === c.currency)) setCurrency(c.currency);
    if (c.country) {
      const s = suggestTax(business.country, c.country);
      setTax({ taxMode: s.taxMode, taxRate: String(s.taxRate), taxLabel: s.taxLabel, noteTitle: s.noteTitle, noteBody: s.noteBody });
    }
  }

  async function draftFromDescription(description: string) {
    const res = await aiDraftItems(description, currency);
    if (!res.ok) return res.error;
    if (!res.data.length) return "Couldn't find any work to invoice in that description.";
    const drafted = res.data.map((i) => ({ title: i.title, ref: "", bulletsText: i.bullets.join("\n"), qty: String(i.qty), price: i.price ? String(i.price) : "" }));
    // Replace the starting blank item; otherwise add below what is already there.
    setItems((list) => [...list.filter((it) => it.title.trim() || it.price.trim() || it.bulletsText.trim()), ...drafted]);
    toast.success(`Added ${drafted.length} line ${drafted.length === 1 ? "item" : "items"}. Check the wording and prices.`);
  }

  const [polishing, setPolishing] = useState<number | null>(null);
  async function polish(i: number) {
    const item = items[i];
    setPolishing(i);
    const res = await aiPolishItem(item.title, item.bulletsText.split("\n").filter((b) => b.trim()));
    setPolishing(null);
    if (!res.ok) return toast.error(res.error);
    updateItem(i, { title: res.data.title || item.title, bulletsText: res.data.bullets.join("\n") });
  }

  const updateItem = (i: number, patch: Partial<ItemDraft>) => setItems((list) => list.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const moveItem = (i: number, by: number) =>
    setItems((list) => {
      const next = [...list];
      [next[i], next[i + by]] = [next[i + by], next[i]];
      return next;
    });

  function submit(intent: "save" | "send") {
    setErrors({});
    startTransition(async () => {
      const result = await saveInvoice(
        invoice?.id ?? null,
        {
          clientId, client, number, issueDate, termsDays: Number(termsDays) || 0, currency, project, serviceType,
          serviceFrom, serviceTo, serviceOngoing, items: lineItems, taxMode: tax.taxMode, taxRate: Number(tax.taxRate) || 0,
          taxLabel: tax.taxLabel, noteTitle: tax.noteTitle, noteBody: tax.noteBody, notes, paymentReference, template,
        },
        intent,
      );
      // A successful save redirects, so anything returned here is an error.
      if (result?.error) {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.error);
      }
    });
  }

  const err = (key: string) => errors[key];
  const docInvoice = {
    number: number || invoice?.number || "", status: invoice?.status, issueDate, termsDays: Number(termsDays) || 0, dueDate,
    currency, client, project, serviceType, serviceFrom, serviceTo, serviceOngoing, items: lineItems,
    taxMode: tax.taxMode, taxRate: Number(tax.taxRate) || 0, taxLabel: tax.taxLabel, noteTitle: tax.noteTitle,
    noteBody: tax.noteBody, notes, paymentReference, amountPaid: invoice?.amountPaid ?? 0, paidAt: invoice?.paidAt,
  };

  return (
    <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="min-w-0">
        <Section
          title="Bill to"
          action={<Link href="/clients/new" className="text-sm text-primary underline-offset-4 hover:underline">Add a new client</Link>}
        >
          {aiEnabled && (
            <AiAssist
              trigger="Fill in from their email"
              label="Paste the message with their billing details"
              placeholder={"Please invoice our GmbH:\nWaldblick Energie GmbH\nMusterstraße 1, 10115 Berlin\nVAT ID DE123456789"}
              action="Fill in the details"
              onRun={fillClientFromMessage}
            />
          )}
          {clients.length > 0 && (
            <Field label="Saved client" htmlFor="clientId" hint="Fills in their details, currency and tax note.">
              <NativeSelect id="clientId" value={clientId} onChange={(e) => pickClient(e.target.value)}>
                <option value="">Choose a client</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </NativeSelect>
            </Field>
          )}
          <Field label="Company or person" htmlFor="clientName" error={err("client.name")}>
            <Input id="clientName" value={client.name} aria-invalid={Boolean(err("client.name"))} onChange={(e) => setClient({ ...client, name: e.target.value })} />
          </Field>
          <Field label="Address" htmlFor="clientAddress">
            <Textarea id="clientAddress" rows={3} value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} />
          </Field>
          <Field label="Registration and VAT numbers">
            <LabelValueEditor
              key={clientVersion}
              defaultValue={client.ids}
              onChange={(ids) => setClient((c) => ({ ...c, ids }))}
              labelPlaceholder="Name, e.g. VAT ID"
              valuePlaceholder="Number"
              addLabel="Add a number"
            />
          </Field>
          {clientId && <p className="text-xs text-muted-foreground">Changes here apply to this invoice only. The saved client stays as it is.</p>}
        </Section>

        <Section title="Invoice details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Invoice number" htmlFor="number" error={err("number")} hint={invoice ? undefined : `Leave empty to use ${defaults.nextNumber}.`}>
              <Input id="number" value={number} placeholder={invoice?.number ?? defaults.nextNumber} onChange={(e) => setNumber(e.target.value)} />
            </Field>
            <Field label="Currency" htmlFor="currency">
              <NativeSelect id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {currencies.map((c) => <option key={c.code} value={c.code}>{c.code}, {c.name}</option>)}
              </NativeSelect>
            </Field>
            <Field label="Invoice date" htmlFor="issueDate" error={err("issueDate")}>
              <Input id="issueDate" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </Field>
            <Field label="Payment due after (days)" htmlFor="termsDays" hint={dueDate ? `Due ${formatDate(dueDate)}` : undefined} error={err("termsDays")}>
              <Input id="termsDays" type="number" min={0} max={365} value={termsDays} onChange={(e) => setTermsDays(e.target.value)} />
            </Field>
          </div>
        </Section>

        <Section title="Project">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Project name" htmlFor="project">
              <Input id="project" value={project} onChange={(e) => setProject(e.target.value)} placeholder="Shown at the top of the invoice" />
            </Field>
            <Field label="Type of service" htmlFor="serviceType">
              <Input id="serviceType" value={serviceType} onChange={(e) => setServiceType(e.target.value)} />
            </Field>
            <Field label="Work started" htmlFor="serviceFrom">
              <Input id="serviceFrom" type="date" value={serviceFrom} onChange={(e) => setServiceFrom(e.target.value)} />
            </Field>
            <Field label="Work finished" htmlFor="serviceTo">
              <Input id="serviceTo" type="date" value={serviceOngoing ? "" : serviceTo} disabled={serviceOngoing} onChange={(e) => setServiceTo(e.target.value)} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={serviceOngoing} onChange={(e) => setServiceOngoing(e.target.checked)} className="size-4 accent-carbon" />
            The work is still ongoing
          </label>
        </Section>

        <Section title="Line items">
          {aiEnabled && (
            <AiAssist
              trigger="Draft items from a description"
              label="Describe the work and the price in your own words"
              placeholder="A website and a price calculator for Acme Ltd, plus CRM integration and German/French translation. 1,440 USD in total, most of it for the website."
              action="Draft line items"
              rows={4}
              onRun={draftFromDescription}
            />
          )}
          {err("items") && <p className="text-sm text-destructive">{err("items")}</p>}
          {items.map((item, i) => (
            <div key={i} className="rounded-lg border border-rule p-4">
              <div className="mb-3 flex items-center gap-1">
                <span className="flex-1 text-sm text-muted-foreground">Item {i + 1}</span>
                <span className="mr-2 text-sm font-semibold">{formatMoney(lineAmount(lineItems[i]), currency)}</span>
                {aiEnabled && (
                  <Button type="button" variant="ghost" size="sm" disabled={polishing !== null || !item.title.trim()} onClick={() => polish(i)}>
                    {polishing === i ? <LoaderCircle className="animate-spin" /> : <Sparkles className="text-carbon" />} Tidy wording
                  </Button>
                )}
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Move up" disabled={i === 0} onClick={() => moveItem(i, -1)}><ArrowUp /></Button>
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Move down" disabled={i === items.length - 1} onClick={() => moveItem(i, 1)}><ArrowDown /></Button>
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Remove item" disabled={items.length === 1} onClick={() => setItems((l) => l.filter((_, j) => j !== i))}><Trash2 /></Button>
              </div>
              <div className="grid gap-3">
                <Field label="Title" htmlFor={`title-${i}`} error={err(`items.${i}.title`)}>
                  <Input id={`title-${i}`} value={item.title} placeholder="e.g. Website development" onChange={(e) => updateItem(i, { title: e.target.value })} />
                </Field>
                <Field label="Reference" htmlFor={`ref-${i}`} hint="Optional, e.g. a quote number.">
                  <Input id={`ref-${i}`} value={item.ref} onChange={(e) => updateItem(i, { ref: e.target.value })} />
                </Field>
                <Field label="What was delivered" htmlFor={`bullets-${i}`} hint="One point per line.">
                  <Textarea id={`bullets-${i}`} rows={3} value={item.bulletsText} onChange={(e) => updateItem(i, { bulletsText: e.target.value })} />
                </Field>
                <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
                  <Field label="Quantity" htmlFor={`qty-${i}`} error={err(`items.${i}.qty`)}>
                    <Input id={`qty-${i}`} type="number" min={0} step="any" value={item.qty} onChange={(e) => updateItem(i, { qty: e.target.value })} />
                  </Field>
                  <Field label={`Unit price (${currency})`} htmlFor={`price-${i}`} error={err(`items.${i}.price`)}>
                    <Input id={`price-${i}`} type="number" step="any" value={item.price} placeholder="0.00" onChange={(e) => updateItem(i, { price: e.target.value })} />
                  </Field>
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" className="justify-self-start" onClick={() => setItems((l) => [...l, blankItem()])}>
            <Plus /> Add a line item
          </Button>
        </Section>

        <Section title="Tax">
          <div className="grid gap-2 sm:grid-cols-3">
            {TAX_MODES.map((m) => (
              <label key={m.value} className="cursor-pointer rounded-lg border border-input p-3 text-sm transition-colors has-checked:border-carbon has-checked:bg-accent has-focus-visible:ring-3 has-focus-visible:ring-ring/50">
                <input
                  type="radio"
                  name="taxMode"
                  value={m.value}
                  checked={tax.taxMode === m.value}
                  onChange={() => setTax((t) => ({ ...t, taxMode: m.value, ...notePreset(m.value, client.country) }))}
                  className="sr-only"
                />
                <span className="block font-medium">{m.label}</span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{m.hint}</span>
              </label>
            ))}
          </div>
          {tax.taxMode === "rate" && (
            <div className="grid grid-cols-2 gap-4 sm:max-w-sm">
              <Field label="Tax name" htmlFor="taxLabel"><Input id="taxLabel" value={tax.taxLabel} onChange={(e) => setTax({ ...tax, taxLabel: e.target.value })} /></Field>
              <Field label="Rate (%)" htmlFor="taxRate" error={err("taxRate")}><Input id="taxRate" type="number" min={0} max={100} step="any" value={tax.taxRate} onChange={(e) => setTax({ ...tax, taxRate: e.target.value })} /></Field>
            </div>
          )}
          <Field label="Note heading" htmlFor="noteTitle" hint="Printed in a highlighted box. Leave empty for no note.">
            <Input id="noteTitle" value={tax.noteTitle} onChange={(e) => setTax({ ...tax, noteTitle: e.target.value })} />
          </Field>
          <Field label="Note text" htmlFor="noteBody">
            <Textarea id="noteBody" rows={3} value={tax.noteBody} onChange={(e) => setTax({ ...tax, noteBody: e.target.value })} />
          </Field>
        </Section>

        <Section title="Notes and payment">
          <Field label="Notes on the invoice" htmlFor="notes">
            <Textarea id="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
          <Field label="Payment reference" htmlFor="paymentReference" hint="Shown with your bank details. Defaults to the invoice number.">
            <Input id="paymentReference" value={paymentReference} placeholder={number || invoice?.number || defaults.nextNumber} onChange={(e) => setPaymentReference(e.target.value)} />
          </Field>
        </Section>

        <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-rule bg-background/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
          <p className="mr-auto text-sm">
            <span className="text-muted-foreground">Total </span>
            <span className="font-semibold">{formatMoney(totals.total, currency)}</span>
          </p>
          <Link href={invoice ? `/invoices/${invoice.id}` : "/invoices"} className={buttonVariants({ variant: "ghost", size: "lg" })}>Cancel</Link>
          <Button type="button" variant="outline" size="lg" disabled={pending} onClick={() => submit("save")}>
            {invoice && invoice.status !== "draft" ? "Save changes" : "Save draft"}
          </Button>
          {(!invoice || invoice.status === "draft") && (
            <Button type="button" size="lg" disabled={pending} onClick={() => submit("send")}>Save and mark as sent</Button>
          )}
        </div>
      </div>

      <aside className="xl:sticky xl:top-6" aria-label="Invoice preview">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Preview of the PDF</p>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Template</span>
            <NativeSelect value={template} onChange={(e) => setTemplate(e.target.value as TemplateId | "")} className="w-auto">
              <option value="">Workspace default ({TEMPLATES.find((t) => t.id === business.invoiceTemplate)?.name})</option>
              {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </NativeSelect>
          </label>
        </div>
        <PdfPreview business={business} invoice={docInvoice} template={effectiveTemplate} />
      </aside>
    </div>
  );
}
