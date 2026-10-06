import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Label, control, hint and error stacked consistently. */
export function Field({
  label, htmlFor, hint, error, className, children,
}: { label: string; htmlFor?: string; hint?: React.ReactNode; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("grid content-start gap-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/** A settings section: title and explanation on the left, fields on the right. */
export function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-b border-rule py-8 first:pt-0 last:border-b-0 lg:grid-cols-[16rem_1fr] lg:gap-10">
      <div>
        <h2 className="font-semibold">{title}</h2>
        {description && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      <div className="grid max-w-2xl gap-5">{children}</div>
    </section>
  );
}
