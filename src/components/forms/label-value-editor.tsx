"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Row = { label: string; value: string };

/** Editable list of label/value pairs (tax numbers, bank details, client IDs), submitted as JSON. */
export function LabelValueEditor({
  name, defaultValue, onChange, labelPlaceholder = "Label", valuePlaceholder = "Value", addLabel = "Add a row", suggestions = [],
}: {
  name?: string;
  onChange?: (rows: Row[]) => void;
  defaultValue: Row[];
  labelPlaceholder?: string;
  valuePlaceholder?: string;
  addLabel?: string;
  suggestions?: string[];
}) {
  const [rows, setRowsState] = useState<Row[]>(defaultValue.length ? defaultValue : [{ label: "", value: "" }]);
  const setRows = (update: (r: Row[]) => Row[]) => {
    const next = update(rows);
    setRowsState(next);
    onChange?.(next.filter((x) => x.label || x.value));
  };
  const update = (i: number, patch: Partial<Row>) => setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  const unused = suggestions.filter((s) => !rows.some((r) => r.label === s));

  return (
    <div className="grid gap-2">
      {name && <input type="hidden" name={name} value={JSON.stringify(rows)} />}
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] gap-2">
          <Input aria-label={`${labelPlaceholder} ${i + 1}`} placeholder={labelPlaceholder} value={row.label} onChange={(e) => update(i, { label: e.target.value })} />
          <Input aria-label={`${valuePlaceholder} ${i + 1}`} placeholder={valuePlaceholder} value={row.value} onChange={(e) => update(i, { value: e.target.value })} />
          <Button type="button" variant="ghost" size="icon" aria-label="Remove row" onClick={() => setRows((r) => r.filter((_, j) => j !== i))}>
            <X />
          </Button>
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setRows((r) => [...r, { label: "", value: "" }])}>
          <Plus /> {addLabel}
        </Button>
        {unused.map((s) => (
          <Button key={s} type="button" variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setRows((r) => [...r.filter((x) => x.label || x.value), { label: s, value: "" }])}>
            + {s}
          </Button>
        ))}
      </div>
    </div>
  );
}
