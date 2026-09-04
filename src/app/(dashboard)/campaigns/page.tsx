import { MetricCard } from "@/features/analytics/metric-card";
import { CampaignsTable } from "@/features/campaigns/campaigns-table";
import { mockCampaigns } from "@/lib/api/mock-data";

export default function CampaignsPage() {
  const totalLeads = mockCampaigns.reduce((s, c) => s + c.leads, 0);
  const totalSpend = mockCampaigns.reduce((s, c) => s + c.spendNaira, 0);
  const avgCpl = totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 0;

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-10 py-6 md:py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-[28px] text-ink">Campaigns</h1>
        <p className="text-sub mt-1">Every Meta and TikTok campaign feeding your inbox, in one place.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <MetricCard label="Leads this month" value={String(totalLeads)} />
        <MetricCard label="Ad spend" value={`₦${totalSpend.toLocaleString("en-NG")}`} />
        <MetricCard label="Avg. cost / lead" value={`₦${avgCpl.toLocaleString("en-NG")}`} />
      </div>
      <CampaignsTable campaigns={mockCampaigns} />
    </div>
  );
}
