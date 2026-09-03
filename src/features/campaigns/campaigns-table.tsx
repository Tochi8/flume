"use client";
import { useMemo } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Campaign } from "@/types";
const columnHelper = createColumnHelper<Campaign>();
const statusVariant: Record<Campaign["status"], "success" | "default" | "outline"> = { active: "success", paused: "default", ended: "outline" };
function nairaFmt(n: number) { return `₦${n.toLocaleString("en-NG")}`; }
export function CampaignsTable({ campaigns }: { campaigns: Campaign[] }) {
  const columns = useMemo(() => [
    columnHelper.accessor("name", { header: "Campaign", cell: (info) => (<div><div className="text-sm font-medium text-ink truncate">{info.getValue()}</div><div className={`text-xs mt-0.5 ${info.row.original.source === "facebook" ? "text-info" : "text-ink"}`}>{info.row.original.sourceLabel}</div></div>) }),
    columnHelper.accessor("leads", { header: "Leads", cell: (info) => <span className="text-sm text-ink">{info.getValue()}</span> }),
    columnHelper.accessor("spendNaira", { header: "Spend", cell: (info) => <span className="text-sm text-ink">{nairaFmt(info.getValue())}</span> }),
    columnHelper.display({ id: "cpl", header: "Cost / lead", cell: (info) => { const { leads, spendNaira } = info.row.original; const cpl = leads > 0 ? Math.round(spendNaira / leads) : null; return <span className="text-sm text-sub">{cpl ? nairaFmt(cpl) : "—"}</span>; } }),
    columnHelper.accessor("status", { header: "Status", cell: (info) => <Badge variant={statusVariant[info.getValue()]} className="capitalize">{info.getValue()}</Badge> }),
  ], []);
  const table = useReactTable({ data: campaigns, columns, getCoreRowModel: getCoreRowModel() });
  return (
    <div className="bg-surface border border-border rounded-card overflow-hidden">
      <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 text-xs font-medium text-faint border-b border-border">
        {table.getHeaderGroups()[0].headers.map((header) => <div key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</div>)}
      </div>
      <div className="divide-y divide-border">
        {table.getRowModel().rows.map((row) => (
          <div key={row.id} className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-2 sm:gap-4 px-5 py-4">
            {row.getVisibleCells().map((cell) => {
              const isMobileVisible = cell.column.id === "name" || cell.column.id === "status";
              const className = isMobileVisible ? (cell.column.id === "status" ? "justify-self-end sm:justify-self-start" : "min-w-0") : "hidden sm:block";
              return <div key={cell.id} className={className}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
