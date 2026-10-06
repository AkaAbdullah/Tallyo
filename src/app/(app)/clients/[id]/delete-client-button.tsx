"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteClient } from "@/server/clients";

export function DeleteClientButton({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="destructive"
      disabled={pending}
      onClick={() => {
        if (confirm(`Delete ${name}? Invoices you have already created for them are kept.`)) start(() => deleteClient(id));
      }}
    >
      {pending ? "Deleting…" : "Delete client"}
    </Button>
  );
}
