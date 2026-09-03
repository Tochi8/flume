import { LeadFilters } from "@/features/leads/lead-filters";
import { mockLeads } from "@/features/leads/data";
export default function InboxPage() {
  const needReply = mockLeads.filter((l) => l.status === "new" || l.status === "contacted").length;
  return (
    <div className="max-w-2xl mx-auto px-5 md:px-0 py-6 md:py-10">
      <div className="md:px-10 mb-5">
        <h1 className="font-display font-bold text-2xl md:text-[28px] text-ink">Leads</h1>
        <p className="text-sub mt-1">{mockLeads.length} this month · {needReply} need a reply</p>
      </div>
      <div className="md:px-10"><LeadFilters leads={mockLeads} /></div>
    </div>
  );
}
