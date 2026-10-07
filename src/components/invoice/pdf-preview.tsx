"use client";

import { useEffect, useRef, useState } from "react";
import { Download, ExternalLink, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { TemplateId } from "@/pdf/registry";
import type { DocBusiness, DocInvoice } from "@/pdf/types";

const loadRenderer = () => import("@/pdf/render-client");

/**
 * Renders the real PDF and shows it in the browser's PDF viewer, so the preview is exactly what downloads.
 * Re-renders shortly after the inputs stop changing.
 */
export function PdfPreview({ business, invoice, template, delay = 450 }: { business: DocBusiness; invoice: DocInvoice; template: TemplateId; delay?: number }) {
  const key = JSON.stringify([business, invoice, template]);
  // `renderedKey` is the input the current PDF was made from; the preview is busy until it catches up.
  const [state, setState] = useState<{ url: string; renderedKey: string; error: string }>({ url: "", renderedKey: "", error: "" });
  const latest = useRef(0);
  const url = state.url;
  const busy = state.renderedKey !== key && !state.error;
  const error = state.error;

  useEffect(() => {
    const run = ++latest.current;
    const timer = setTimeout(async () => {
      try {
        const { renderInvoiceBlob } = await loadRenderer();
        const blob = await renderInvoiceBlob(business, invoice, template);
        if (run !== latest.current) return;
        setState((old) => {
          if (old.url) URL.revokeObjectURL(old.url);
          return { url: URL.createObjectURL(blob), renderedKey: key, error: "" };
        });
      } catch (e) {
        if (run === latest.current) setState((old) => ({ ...old, renderedKey: key, error: (e as Error).message || "The preview could not be created." }));
      }
    }, latest.current === 1 ? 0 : delay);
    return () => clearTimeout(timer);
    // `key` captures every input; the objects themselves change identity on each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Revoke the last blob URL when the preview unmounts (earlier ones are revoked as they are replaced).
  const urlRef = useRef(url);
  urlRef.current = url;
  useEffect(() => () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); }, []);

  return (
    <div className="relative overflow-hidden rounded-lg border border-rule bg-muted/40" style={{ aspectRatio: "595 / 842" }}>
      {url && <iframe title="Invoice PDF preview" src={`${url}#toolbar=0&navpanes=0&view=FitH`} className="absolute inset-0 size-full" />}
      {(busy || !url) && !error && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-background/90 px-2 py-1 text-xs text-muted-foreground shadow-sm">
          <LoaderCircle className="size-3.5 animate-spin" /> Updating preview
        </span>
      )}
      {error && <p className="absolute inset-x-4 top-4 rounded-md bg-background p-3 text-sm text-destructive shadow-sm">{error}</p>}
      {url && (
        <a href={url} target="_blank" rel="noreferrer" className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-md bg-background/90 px-2 py-1 text-xs shadow-sm hover:text-primary">
          <ExternalLink className="size-3.5" /> Open full size
        </a>
      )}
    </div>
  );
}

/** Generates the PDF on click and downloads it. */
export function DownloadPdfButton({ business, invoice, template, size = "lg", variant = "outline" }: {
  business: DocBusiness; invoice: DocInvoice; template: TemplateId; size?: "default" | "lg"; variant?: "outline" | "default";
}) {
  const [busy, setBusy] = useState(false);
  async function download() {
    setBusy(true);
    try {
      const { renderInvoiceBlob, pdfFileName } = await loadRenderer();
      const blob = await renderInvoiceBlob(business, invoice, template);
      const href = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), { href, download: pdfFileName(invoice) });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 10_000);
    } catch (e) {
      toast.error((e as Error).message || "The PDF could not be created.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Button size={size} variant={variant} onClick={download} disabled={busy}>
      {busy ? <LoaderCircle className="animate-spin" /> : <Download />} Download PDF
    </Button>
  );
}
