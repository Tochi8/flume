import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({ label, value, delta, tone = "default", className }: { label: string; value: string; delta?: string; tone?: "default" | "green"; className?: string }) {
  return (
    <Card className={cn("p-4 md:p-5", tone === "green" && "bg-green-surface border-green/20", className)}>
      <div className={cn("text-sm", tone === "green" ? "text-green-dark" : "text-sub")}>{label}</div>
      <div className="flex items-end gap-2 mt-2">
        <span className={cn("font-display font-bold text-3xl", tone === "green" ? "text-green-dark" : "text-ink")}>{value}</span>
        {delta && <span className="text-xs font-medium text-success mb-1">{delta}</span>}
      </div>
    </Card>
  );
}
