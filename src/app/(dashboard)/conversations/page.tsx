import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LeadStatusBadge } from "@/features/leads/lead-badges";
import { requireSession } from "@/lib/auth/session";
import { toUiLead } from "@/lib/server/map-lead";
import { listThreadsNeedingReply } from "../../../../lib/store.js";

export const dynamic = "force-dynamic";

export default async function ConversationsPage() {
  const { tenantId } = await requireSession();
  const storeLeads = await listThreadsNeedingReply(tenantId);
  const threads = storeLeads.filter(Boolean).map((l) => toUiLead(l!));

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-10 py-6 md:py-10">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl md:text-[28px] text-ink">Conversations</h1>
        <p className="text-sub mt-1">
          {threads.length === 0 ? "No threads need a reply right now." : `${threads.length} needing a reply`}
        </p>
      </div>
      <div className="bg-surface border border-border rounded-card divide-y divide-border overflow-hidden">
        {threads.map((lead) => (
          <Link
            key={lead.id}
            href={`/inbox/${lead.id}`}
            className="flex items-center gap-3 px-5 py-4 hover:bg-muted/50 transition-colors"
          >
            <Avatar className="h-10 w-10 text-sm">
              <AvatarFallback>{lead.avatarInitial}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-ink truncate">{lead.name}</span>
                <span className="text-xs text-faint shrink-0">{lead.lastMessageAt}</span>
              </div>
              <p className="text-sm text-sub truncate mt-0.5">{lead.lastMessage || "Open thread"}</p>
            </div>
            <LeadStatusBadge status={lead.status} />
          </Link>
        ))}
        {threads.length === 0 && (
          <p className="px-5 py-8 text-sm text-faint text-center">
            When leads message you, they&apos;ll show up here.{" "}
            <Link href="/inbox" className="text-green-dark font-medium">
              View all leads
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
