"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const MAX_SIDE = 512;

/** Picks an image, scales it down in the browser and stores it as a PNG data URL (works in PDFs too). */
export function LogoInput({ name, defaultValue, fallback }: { name: string; defaultValue: string; fallback: string }) {
  const [logo, setLogo] = useState(defaultValue);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    setError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Choose an image file (PNG, JPG, WebP or SVG).");
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth || MAX_SIDE, img.naturalHeight || MAX_SIDE));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round((img.naturalWidth || MAX_SIDE) * scale));
      canvas.height = Math.max(1, Math.round((img.naturalHeight || MAX_SIDE) * scale));
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL("image/png");
      if (data.length > 690_000) return setError("That image is still too large after resizing. Try a simpler logo.");
      setLogo(data);
    } catch {
      setError("That image couldn't be read. Try a PNG or JPG.");
    } finally {
      URL.revokeObjectURL(url);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-4">
      <input type="hidden" name={name} value={logo} />
      <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- local data URL
          <img src={logo} alt="Your logo" className="max-h-full max-w-full object-contain p-1.5" />
        ) : (
          <span className="text-2xl font-semibold text-[#1e2026]/40">{fallback.slice(0, 1).toUpperCase()}</span>
        )}
      </div>
      <div className="grid gap-1.5">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>{logo ? "Replace logo" : "Upload logo"}</Button>
          {logo && <Button type="button" variant="ghost" onClick={() => setLogo("")}>Remove</Button>}
        </div>
        <p className="text-xs text-muted-foreground">PNG with a transparent background looks best. Scaled to 512 px.</p>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  );
}
