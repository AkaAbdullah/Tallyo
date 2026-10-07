"use client";

import { useActionState, useState } from "react";
import { toast } from "sonner";
import { Field, FormSection } from "@/components/forms/field";
import { LabelValueEditor } from "@/components/forms/label-value-editor";
import { LogoInput } from "@/components/forms/logo-input";
import { TemplatePicker } from "@/components/forms/template-picker";
import { NativeSelect } from "@/components/native-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateBusiness } from "@/server/business";
import type { BusinessDTO } from "@/server/dto";

type Option = { code: string; name: string };

export function SettingsForm({ business: b, countries, currencies }: { business: BusinessDTO; countries: Option[]; currencies: Option[] }) {
  // Toast from the action itself: a successful save remounts this form (see the key in page.tsx).
  const [state, action, pending] = useActionState(async (prev: Awaited<ReturnType<typeof updateBusiness>>, data: FormData) => {
    const result = await updateBusiness(prev, data);
    if (result?.ok) toast.success("Settings saved");
    else if (result?.error) toast.error(result.error);
    return result;
  }, undefined);
  const [prefix, setPrefix] = useState(b.invoicePrefix);
  const [digits, setDigits] = useState(b.numberDigits);
  const [next, setNext] = useState(b.nextNumber);
  const err = state?.fieldErrors ?? {};

  const preview = `${prefix}${String(next || 1).padStart(Math.min(Math.max(digits || 1, 1), 12), "0")}`;

  return (
    <form action={action}>
      <FormSection title="Business" description="Who the invoice is from. Use your registered legal name.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Business name" htmlFor="name" error={err.name}>
            <Input id="name" name="name" defaultValue={b.name} required />
          </Field>
          <Field label="Legal form" htmlFor="legalForm" hint="For example Sole proprietorship, GmbH or Ltd.">
            <Input id="legalForm" name="legalForm" defaultValue={b.legalForm} />
          </Field>
          <Field label="Owner or contact name" htmlFor="ownerName">
            <Input id="ownerName" name="ownerName" defaultValue={b.ownerName} />
          </Field>
          <Field label="Their title" htmlFor="ownerTitle" hint="For example Owner or Managing Director.">
            <Input id="ownerTitle" name="ownerTitle" defaultValue={b.ownerTitle} />
          </Field>
        </div>
        <Field label="Address" htmlFor="address" error={err.address}>
          <Textarea id="address" name="address" defaultValue={b.address} rows={3} />
        </Field>
        <Field label="Country" htmlFor="country" error={err.country} className="sm:max-w-xs">
          <NativeSelect id="country" name="country" defaultValue={b.country}>
            {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </NativeSelect>
        </Field>
      </FormSection>

      <FormSection title="Contact" description="Printed in the invoice header so clients can reach you.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" htmlFor="email" error={err.email}>
            <Input id="email" name="email" type="email" defaultValue={b.email} />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <Input id="phone" name="phone" type="tel" defaultValue={b.phone} placeholder="+44 20 7946 0000" />
          </Field>
        </div>
        <Field label="Website" htmlFor="website" className="sm:max-w-sm">
          <Input id="website" name="website" defaultValue={b.website} placeholder="example.com" />
        </Field>
      </FormSection>

      <FormSection title="Branding" description="Your logo goes at the top of each invoice. The colour is used for the balance due.">
        <Field label="Logo" error={err.logo}>
          <LogoInput name="logo" defaultValue={b.logo} fallback={b.name} />
        </Field>
        <Field label="Brand colour" htmlFor="brandColor" error={err.brandColor}>
          <div className="flex items-center gap-3">
            <input id="brandColor" name="brandColor" type="color" defaultValue={b.brandColor} className="h-9 w-14 cursor-pointer rounded-md border bg-transparent p-1" />
            <span className="text-sm text-muted-foreground">Pick a dark colour so white text stays readable on it.</span>
          </div>
        </Field>
      </FormSection>

      <FormSection title="Tax and registration numbers" description="Shown under your name. Add every number your clients or tax office need to see.">
        <LabelValueEditor
          name="taxIds"
          defaultValue={b.taxIds}
          labelPlaceholder="Name, e.g. VAT ID"
          valuePlaceholder="Number"
          addLabel="Add a number"
          suggestions={["VAT ID", "Tax number", "Company number"]}
        />
      </FormSection>

      <FormSection title="Bank details" description="Printed under Payment details, in this order.">
        <LabelValueEditor
          name="bankDetails"
          defaultValue={b.bankDetails}
          labelPlaceholder="Name, e.g. IBAN"
          valuePlaceholder="Value"
          addLabel="Add a detail"
          suggestions={["Account name", "Bank", "IBAN", "SWIFT / BIC"]}
        />
      </FormSection>

      <FormSection title="Invoice design" description="The template used for new invoices and PDFs. You can pick a different one on any invoice.">
        <TemplatePicker name="invoiceTemplate" defaultValue={b.invoiceTemplate} />
      </FormSection>

      <FormSection title="Invoice numbers" description="Each new invoice takes the next number automatically.">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Prefix" htmlFor="invoicePrefix">
            <Input id="invoicePrefix" name="invoicePrefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} maxLength={12} />
          </Field>
          <Field label="Digits" htmlFor="numberDigits">
            <Input id="numberDigits" name="numberDigits" type="number" min={1} max={12} value={digits} onChange={(e) => setDigits(Number(e.target.value))} />
          </Field>
          <Field label="Next number" htmlFor="nextNumber" error={err.nextNumber}>
            <Input id="nextNumber" name="nextNumber" type="number" min={1} value={next} onChange={(e) => setNext(Number(e.target.value))} />
          </Field>
        </div>
        <p className="text-sm text-muted-foreground">
          Your next invoice will be <span className="font-medium text-foreground">{preview}</span>.
        </p>
      </FormSection>

      <FormSection title="Defaults" description="Used for new invoices. You can change them on each invoice.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Currency" htmlFor="defaultCurrency">
            <NativeSelect id="defaultCurrency" name="defaultCurrency" defaultValue={b.defaultCurrency}>
              {currencies.map((c) => <option key={c.code} value={c.code}>{c.code}, {c.name}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Payment due after (days)" htmlFor="defaultTermsDays" hint="Use 0 for due on receipt." error={err.defaultTermsDays}>
            <Input id="defaultTermsDays" name="defaultTermsDays" type="number" min={0} max={365} defaultValue={b.defaultTermsDays} />
          </Field>
        </div>
        <Field label="Note at the bottom of invoices" htmlFor="defaultNotes">
          <Textarea id="defaultNotes" name="defaultNotes" defaultValue={b.defaultNotes} rows={2} />
        </Field>
        <Field label="Footer line" htmlFor="footerText" hint="Small print at the bottom of every page, such as your registration details.">
          <Input id="footerText" name="footerText" defaultValue={b.footerText} />
        </Field>
      </FormSection>

      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t border-rule bg-background/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        {state?.error && <p className="mr-auto text-sm text-destructive">{state.error}</p>}
        <Button type="submit" size="lg" disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button>
      </div>
    </form>
  );
}
