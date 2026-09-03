import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LeadScore, LeadIntentLabel, leadStatusLabel } from "./lead-badges";
import type { Lead } from "@/types";

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <Link href={`/inbox/${lead.id}`} className="block bg-surface border border-border rounded-card p-4 hover:border-green/40 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-9 w-9"><AvatarFallback>{lead.avatarInitial}</AvatarFallback></Avatar>
          <div>
            <div className="text-sm font-medium text-ink">{lead.name}</div>
            <div className="text-xs text-faint">{lead.phone}</div>
          </div>
        </div>
        <LeadScore score={lead.score} intent={lead.intent} />
      </div>
      <p className="text-sm text-ink leading-snug mb-2">&ldquo;{lead.lastMessage}&rdquo;</p>
      <div className="flex items-center gap-2 text-xs text-faint">
        <LeadIntentLabel intent={lead.intent} />
        <span>·</span>
        <span>{leadStatusLabel(lead.status)}</span>
        <span>·</span>
        <span>{lead.lastMessageAt}</span>
      </div>
    </Link>
  );
}
