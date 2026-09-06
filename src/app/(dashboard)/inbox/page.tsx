import { LeadFilters } from "@/features/leads/lead-filters";
import { requireSession } from "@/lib/auth/session";
import { toUiLead } from "@/lib/server/map-lead";
import { listLeads } from "../../../../lib/store.js";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const { tenantId } = await requireSession();
  const storeLeads = await listLeads(tenantId);
  const leads = storeLeads.filter(Boolean).map((l) => toUiLead(l!));
  const needReply = leads.filter((l) => l.status === "new" || l.status === "contacted").length;
  return (
    <div className="max-w-2xl mx-auto px-5 md:px-0 py-6 md:py-10">
      <div className="md:px-10 mb-5">
        <h1 className="font-display font-bold text-2xl md:text-[28px] text-ink">Leads</h1>
        <p className="text-sub mt-1">
          {leads.length} this month · {needReply} need a reply
        </p>
      </div>
      <div className="md:px-10">
        <LeadFilters leads={leads} />
      </div>
    </div>
  );
}
