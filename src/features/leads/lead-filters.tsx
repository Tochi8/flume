"use client";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { LeadCard } from "./lead-card";
import type { Lead, LeadStatus } from "@/types";

const filters: { label: string; value: LeadStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Qualified", value: "qualified" },
  { label: "Contacted", value: "contacted" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
  { label: "Junk", value: "junk" },
];

export function LeadFilters({ leads }: { leads: Lead[] }) {
  const [active, setActive] = useState<LeadStatus | "all">("all");
  const filtered = useMemo(() => (active === "all" ? leads : leads.filter((l) => l.status === active)), [leads, active]);
  return (
    <div>
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button key={f.value} onClick={() => setActive(f.value)} className={cn("shrink-0 text-sm font-medium px-4 py-2 rounded-pill border transition-colors", active === f.value ? "bg-ink text-white border-ink" : "text-sub border-border hover:bg-muted")}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.length === 0 ? <p className="text-sm text-faint py-8 text-center">No leads in this view yet.</p> : filtered.map((lead) => <LeadCard key={lead.id} lead={lead} />)}
      </div>
    </div>
  );
}
