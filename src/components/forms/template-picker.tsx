import { TEMPLATES, type TemplateId } from "@/pdf/registry";

/** Radio cards with a thumbnail of each invoice template. */
export function TemplatePicker({ name, defaultValue }: { name: string; defaultValue: TemplateId }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {TEMPLATES.map((t) => (
        <label
          key={t.id}
          className="group cursor-pointer rounded-lg border border-input p-2 transition-colors has-checked:border-carbon has-checked:bg-accent has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
        >
          <input type="radio" name={name} value={t.id} defaultChecked={defaultValue === t.id} className="sr-only" />
          {/* eslint-disable-next-line @next/next/no-img-element -- small static thumbnails */}
          <img src={`/templates/${t.id}.png`} alt="" width={298} height={421} className="aspect-[595/842] w-full rounded border border-rule bg-white object-cover" />
          <span className="mt-2 block text-sm font-medium">{t.name}</span>
          <span className="block text-xs leading-snug text-muted-foreground">{t.description}</span>
        </label>
      ))}
    </div>
  );
}
