import Image from "next/image";
import { cn } from "@/lib/utils";

/** Tallyo mark (public/logo.png; the full-size source is public/logo-original.png). */
export function LogoMark({ className }: { className?: string }) {
  return <Image src="/logo.png" alt="" width={32} height={32} priority className={cn("size-7 shrink-0 object-contain", className)} />;
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-lg font-semibold tracking-tight", className)}>
      <LogoMark />
      Tallyo
    </span>
  );
}
