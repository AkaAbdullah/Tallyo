import { cn } from "@/lib/utils";

/** Tallyo mark: four tally strokes crossed by a fifth. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-7", className)}>
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <g className="stroke-primary-foreground" strokeWidth="2.4" strokeLinecap="round">
        <path d="M9 9v14M13.7 9v14M18.3 9v14M23 9v14" />
        <path d="M6.5 20.5 25.5 11.5" />
      </g>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-lg font-semibold tracking-tight", className)}>
      <LogoMark />
      Tallyo
    </span>
  );
}
