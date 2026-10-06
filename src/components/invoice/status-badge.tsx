import { cn } from "@/lib/utils";
import type { DisplayStatus } from "@/server/invoice-queries";

const styles: Record<DisplayStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-accent text-carbon",
  partial: "bg-accent text-carbon",
  overdue: "bg-[#fff1d6] text-[#8a5a00] dark:bg-[#4a3a12] dark:text-[#f3cf7a]",
  paid: "bg-[#dff5e8] text-[#0b7a3e] dark:bg-[#123b26] dark:text-[#7fd6a4]",
  void: "bg-[#fde4e1] text-[#a3261b] dark:bg-[#47201c] dark:text-[#f19a90]",
};

const labels: Record<DisplayStatus, string> = {
  draft: "Draft", sent: "Sent", partial: "Part paid", overdue: "Overdue", paid: "Paid", void: "Void",
};

export function StatusBadge({ status, className }: { status: DisplayStatus; className?: string }) {
  return <span className={cn("inline-flex rounded-md px-2 py-0.5 text-xs font-medium", styles[status], className)}>{labels[status]}</span>;
}
