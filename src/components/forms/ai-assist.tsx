"use client";

import { useState, useTransition } from "react";
import { LoaderCircle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/**
 * A collapsible "do this with AI" box: a text area, one action, and a reminder to check the result.
 * `onRun` returns an error message, or nothing on success.
 */
export function AiAssist({
  trigger, label, placeholder, action, onRun, rows = 5,
}: {
  trigger: string;
  label: string;
  placeholder: string;
  action: string;
  onRun: (text: string) => Promise<string | void>;
  rows?: number;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  if (!open) {
    return (
      <Button type="button" variant="outline" className="justify-self-start" onClick={() => setOpen(true)}>
        <Sparkles className="text-carbon" /> {trigger}
      </Button>
    );
  }

  return (
    <div className="rounded-lg border border-carbon/30 bg-accent/50 p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <label htmlFor={`ai-${trigger}`} className="text-sm font-medium">{label}</label>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Close" onClick={() => setOpen(false)}><X /></Button>
      </div>
      <Textarea id={`ai-${trigger}`} rows={rows} value={text} placeholder={placeholder} onChange={(e) => setText(e.target.value)} className="bg-background" />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          disabled={pending || !text.trim()}
          onClick={() =>
            start(async () => {
              setError("");
              const err = await onRun(text);
              if (err) setError(err);
              else setOpen(false);
            })
          }
        >
          {pending ? <LoaderCircle className="animate-spin" /> : <Sparkles />} {pending ? "Working…" : action}
        </Button>
        <p className="text-xs text-muted-foreground">The result fills the form for you to check. Nothing is saved until you save.</p>
      </div>
    </div>
  );
}
