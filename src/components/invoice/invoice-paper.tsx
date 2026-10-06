"use client";

import { useLayoutEffect, useRef, useState } from "react";

const PAGE_WIDTH = 794;

/** Scales the 794px-wide invoice page to fit its container, keeping its full height (long invoices included). */
export function InvoicePaper({ children }: { children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ scale: 0, height: 0 });

  useLayoutEffect(() => {
    const update = () => {
      if (!outer.current || !inner.current) return;
      const scale = outer.current.clientWidth / PAGE_WIDTH;
      setSize({ scale, height: inner.current.offsetHeight * scale });
    };
    update();
    const ro = new ResizeObserver(update);
    if (outer.current) ro.observe(outer.current);
    if (inner.current) ro.observe(inner.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outer} className="w-full">
      <div
        className="relative overflow-hidden rounded-md shadow-[0_1px_2px_rgba(30,32,38,.06),0_12px_32px_-12px_rgba(30,32,38,.25)] ring-1 ring-black/5"
        style={{ height: size.height || undefined, aspectRatio: size.height ? undefined : "794 / 1123" }}
      >
        <div
          ref={inner}
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: PAGE_WIDTH, transform: `scale(${size.scale || 0.0001})`, visibility: size.scale ? "visible" : "hidden" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
