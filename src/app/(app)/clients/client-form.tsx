"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Field, FormSection } from "@/components/forms/field";
import { LabelValueEditor } from "@/components/forms/label-value-editor";
import { NativeSelect } from "@/components/native-select";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { notePreset, suggestTax, TAX_MODES, type TaxMode } from "@/lib/tax";
import { saveClient } from "@/server/clients";
import type { ClientDTO } from "@/server/dto";

type Option = { code: string; name: string };

export function ClientForm({
  client, sellerCountry, defaultCurrency, countries, currencies,
}: {
  client?: ClientDTO;
  sellerCountry: string;
  defaultCurrency: string;
  countries: Option[];
  currencies: Option[];
}) {
  const [state, action, pending] = useActionState(saveClient, undefined);
  const err = state?.fieldErrors ?? {};
  const [country, setCountry] = useState(client?.country ?? "");
  const [tax, setTax] = useState(() =>
    client
      ? { taxMode: client.taxMode, taxRate: client.taxRate, taxLabel: client.taxLabel, noteTitle: client.noteTitle, noteBody: client.noteBody }
      : suggestTax(sellerCountry, ""),
  );
  // Until the user edits tax fields themselves, follow the suggestion for the chosen country.
  const [taxTouched, setTaxTouched] = useState(Boolean(client));
  const countryName = countries.find((c) => c.code === country)?.name;
  const suggestion = country ? suggestTax(sellerCountry, country) : null;

  function onCountry(code: string) {
    setCountry(code);
    if (!taxTouched) setTax(suggestTax(sellerCountry, code));
  }

  function onMode(mode: TaxMode) {
    setTaxTouched(true);
    setTax((t) => ({ ...t, taxMode: mode, ...notePreset(mode, country) }));
  }

  return (
    <form action={action}>
      {client && <input type="hidden" name="id" value={client.id} />}
      <FormSection title="Company" description="As it should appear under Bill to.">
        <Field label="Company or person" htmlFor="name" error={err.name}>
          <Input id="name" name="name" defaultValue={client?.name} required autoFocus={!client} />
        </Field>
        <Field label="Address" htmlFor="address" hint="Street, postcode and city, one per line.">
          <Textarea id="address" name="address" defaultValue={client?.address} rows={3} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Country" htmlFor="country">
            <NativeSelect id="country" name="country" value={country} onChange={(e) => onCountry(e.target.value)}>
              <option value="">Not specified</option>
              {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Billing email" htmlFor="email" error={err.email} hint="For your reference. Not printed.">
            <Input id="email" name="email" type="email" defaultValue={client?.email} />
          </Field>
        </div>
        <Field label="Registration and VAT numbers">
          <LabelValueEditor
            name="ids"
            defaultValue={client?.ids ?? []}
            labelPlaceholder="Name, e.g. VAT ID"
            valuePlaceholder="Number"
            addLabel="Add a number"
            suggestions={["VAT ID", "Company number"]}
          />
        </Field>
      </FormSection>

      <FormSection title="Billing" description="Used every time you invoice this client. You can still change it per invoice.">
        <Field label="Currency" htmlFor="currency" className="sm:max-w-xs">
          <NativeSelect id="currency" name="currency" defaultValue={client?.currency ?? defaultCurrency}>
            {currencies.map((c) => <option key={c.code} value={c.code}>{c.code}, {c.name}</option>)}
          </NativeSelect>
        </Field>

        <fieldset className="grid gap-2">
          <legend className="mb-1.5 text-sm font-medium">Tax</legend>
          <input type="hidden" name="taxMode" value={tax.taxMode} />
          <div className="grid gap-2 sm:grid-cols-3">
            {TAX_MODES.map((m) => (
              <label
                key={m.value}
                className="cursor-pointer rounded-lg border border-input p-3 text-sm transition-colors has-checked:border-carbon has-checked:bg-accent has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
              >
                <input type="radio" name="taxModeChoice" value={m.value} checked={tax.taxMode === m.value} onChange={() => onMode(m.value)} className="sr-only" />
                <span className="block font-medium">{m.label}</span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{m.hint}</span>
              </label>
            ))}
          </div>
          {suggestion && countryName && (
            <p className="text-xs text-muted-foreground">
              {suggestion.taxMode === tax.taxMode
                ? `This is the usual choice for a business client in ${countryName}.`
                : `For a business client in ${countryName}, ${TAX_MODES.find((m) => m.value === suggestion.taxMode)?.label.toLowerCase()} is the usual choice.`}{" "}
              Check with your accountant if you are unsure.
            </p>
          )}
        </fieldset>

        {tax.taxMode === "rate" && (
          <div className="grid grid-cols-2 gap-5 sm:max-w-sm">
            <Field label="Tax name" htmlFor="taxLabel">
              <Input id="taxLabel" name="taxLabel" value={tax.taxLabel} onChange={(e) => { setTaxTouched(true); setTax((t) => ({ ...t, taxLabel: e.target.value })); }} />
            </Field>
            <Field label="Rate (%)" htmlFor="taxRate" error={err.taxRate}>
              <Input id="taxRate" name="taxRate" type="number" min={0} max={100} step="any" value={tax.taxRate} onChange={(e) => { setTaxTouched(true); setTax((t) => ({ ...t, taxRate: Number(e.target.value) })); }} />
            </Field>
          </div>
        )}
        {tax.taxMode !== "rate" && <input type="hidden" name="taxLabel" value={tax.taxLabel || "VAT"} />}

        <Field label="Note heading" htmlFor="noteTitle" hint="Printed in a highlighted box on the invoice. Leave empty for no note.">
          <Input id="noteTitle" name="noteTitle" value={tax.noteTitle} onChange={(e) => { setTaxTouched(true); setTax((t) => ({ ...t, noteTitle: e.target.value })); }} />
        </Field>
        <Field label="Note text" htmlFor="noteBody">
          <Textarea id="noteBody" name="noteBody" rows={3} value={tax.noteBody} onChange={(e) => { setTaxTouched(true); setTax((t) => ({ ...t, noteBody: e.target.value })); }} />
        </Field>
      </FormSection>

      <FormSection title="Private notes" description="Only your workspace sees these.">
        <Field label="Notes" htmlFor="notes">
          <Textarea id="notes" name="notes" defaultValue={client?.notes} rows={3} placeholder="Contact person, how they like to be invoiced, purchase order rules…" />
        </Field>
      </FormSection>

      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t border-rule bg-background/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        {state?.error && <p className="mr-auto text-sm text-destructive">{state.error}</p>}
        <Link href="/clients" className={buttonVariants({ variant: "ghost", size: "lg" })}>Cancel</Link>
        <Button type="submit" size="lg" disabled={pending}>{pending ? "Saving…" : client ? "Save changes" : "Add client"}</Button>
      </div>
    </form>
  );
}
