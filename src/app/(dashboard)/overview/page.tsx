import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/features/analytics/metric-card";
import { LeadActivityChart } from "@/features/analytics/lead-activity-chart";
import { LeadStatusBadge } from "@/features/leads/lead-badges";
import { requireSession } from "@/lib/auth/session";
import { toUiLead } from "@/lib/server/map-lead";
import { listLeads } from "../../../../lib/store.js";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const { tenant, tenantId } = await requireSession();
  const storeLeads = await listLeads(tenantId);
  const leads = storeLeads.filter(Boolean).map((l) => toUiLead(l!));
  const recent = leads.slice(0, 3);
  const won = leads.filter((l) => l.status === "won").length;
  const replied = leads.filter((l) => l.status !== "new").length;
  const replyRate = leads.length ? Math.round((replied / leads.length) * 100) : 0;
  const greetingName = tenant.name || "there";
  return (
    <div className="max-w-5xl mx-auto px-5 md:px-10 py-6 md:py-10">
      <div className="mb-6 md:mb-8">
        <h1 className="font-display font-bold text-2xl md:text-[28px] text-ink">
          Good morning, {greetingName}
        </h1>
        <p className="text-sub mt-1">Here&apos;s what&apos;s happening with your leads.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
        <MetricCard label="Leads this month" value={String(leads.length)} />
        <MetricCard label="Replied" value={`${replyRate}%`} />
        <MetricCard label="Won" value={String(won)} tone="green" className="col-span-2 md:col-span-1" />
      </div>
      <Card className="p-5 md:p-6 mb-8">
        <CardHeader className="mb-6">
          <CardTitle>Lead activity</CardTitle>
          <span className="text-xs text-faint">Last 14 days</span>
        </CardHeader>
        <LeadActivityChart />
      </Card>
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-display font-semibold text-lg text-ink">Recent leads</h2>
          <Link href="/inbox" className="text-sm font-medium text-green-dark">
            View all
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recent.map((lead) => (
            <Link
              key={lead.id}
              href={`/inbox/${lead.id}`}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 text-xs">
                  <AvatarFallback>{lead.avatarInitial}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-ink">{lead.name}</span>
              </div>
              <span className="text-sm text-sub hidden sm:block">{lead.score}</span>
              <LeadStatusBadge status={lead.status} />
            </Link>
          ))}
          {recent.length === 0 && (
            <p className="px-5 py-6 text-sm text-faint">No leads yet. Connect a channel to start.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
