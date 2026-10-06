"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Copy, MoreHorizontal, Pencil, Send } from "lucide-react";
import { toast } from "sonner";
import { Field } from "@/components/forms/field";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { formatMoney, todayISO } from "@/lib/money";
import { deleteInvoice, duplicateInvoice, markPaid, markSent, markUnpaid, recordPayment, voidInvoice } from "@/server/invoices";

type Props = { id: string; number: string; status: "draft" | "sent" | "paid" | "void"; balance: number; currency: string };

function useAction() {
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<unknown>, success?: string) =>
    start(async () => {
      try {
        await fn();
        if (success) toast.success(success);
      } catch (e) {
        // redirect() inside an action throws a special error that must propagate
        if ((e as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) throw e;
        toast.error((e as Error).message || "Something went wrong");
      }
    });
  return [pending, run] as const;
}

export function InvoiceToolbar({ id, number, status }: Props) {
  const [pending, run] = useAction();
  return (
    <div className="flex flex-wrap items-center gap-2">
      {status !== "void" && (
        <Link href={`/invoices/${id}/edit`} className={buttonVariants({ variant: "outline", size: "lg" })}>
          <Pencil /> Edit
        </Link>
      )}
      {status === "draft" && (
        <Button size="lg" disabled={pending} onClick={() => run(() => markSent(id), `${number} marked as sent`)}>
          <Send /> Mark as sent
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="icon-lg" aria-label="More actions" disabled={pending} />}>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={() => run(() => duplicateInvoice(id))}><Copy /> Duplicate as new draft</DropdownMenuItem>
          {status === "paid" && <DropdownMenuItem onClick={() => run(() => markUnpaid(id), "Payment removed")}>Mark as unpaid</DropdownMenuItem>}
          {status !== "void" && status !== "draft" && (
            <DropdownMenuItem onClick={() => confirm(`Void ${number}? It stays in your records but can't be edited or paid.`) && run(() => voidInvoice(id), `${number} voided`)}>
              Void invoice
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => confirm(`Delete ${number} permanently? This can't be undone.`) && run(() => deleteInvoice(id))}>
            Delete invoice
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function PaymentForm({ id, status, balance, currency }: Props) {
  const [pending, run] = useAction();
  const [amount, setAmount] = useState(balance > 0 ? String(balance) : "");
  const [date, setDate] = useState(todayISO());
  if (status === "void" || status === "paid" || balance <= 0) return null;

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        run(() => recordPayment(id, Number(amount), date), Number(amount) >= balance ? "Marked as paid" : "Payment recorded");
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label={`Amount (${currency})`} htmlFor="payAmount">
          <Input id="payAmount" type="number" step="any" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </Field>
        <Field label="Paid on" htmlFor="payDate">
          <Input id="payDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </Field>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>Record payment</Button>
        <Button type="button" variant="ghost" disabled={pending} onClick={() => run(() => markPaid(id, date), "Marked as paid")}>
          Paid in full ({formatMoney(balance, currency)})
        </Button>
      </div>
    </form>
  );
}
