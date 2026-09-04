import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  delta,
  tone = "default",
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: "default" | "green";
  className?: string;
}) {
  return (
    <Card className={cn("px-6 py-6 md:px-8 md:py-7 min-w-0", tone === "green" && "bg-green-surface border-green/20", className)}>
      <div className={cn("text-sm leading-snug", tone === "green" ? "text-green-dark" : "text-sub")}>
        {label}
      </div>
      <div className="mt-4 flex items-end gap-2 min-w-0">
        <span
          className={cn(
            "font-display font-bold text-[28px] md:text-[32px] leading-none tracking-tight",
            tone === "green" ? "text-green-dark" : "text-ink"
          )}
        >
          {value}
        </span>
        {delta && <span className="text-xs font-medium text-success mb-0.5 shrink-0">{delta}</span>}
      </div>
    </Card>
  );
}
