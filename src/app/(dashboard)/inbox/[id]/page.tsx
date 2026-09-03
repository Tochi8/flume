import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LeadStatusBadge } from "@/features/leads/lead-badges";
import { MessageBubble } from "@/features/conversations/message-bubble";
import { SuggestedReply } from "@/features/conversations/suggested-reply";
import { getLeadById, mockMessages } from "@/features/leads/data";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = getLeadById(id);
  if (!lead) notFound();
  const messages = mockMessages[lead.id] ?? [];
  const suggestedReply = "Hi Adebayo, thanks for reaching out. We can help with the 20 chairs for your event next Saturday. Would you like me to send you our available options and pricing?";
  return (
    <div className="md:h-screen md:flex md:flex-col">
      <header className="h-14 flex items-center justify-between px-5 md:px-6 border-b border-border bg-surface shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/inbox" className="text-sub"><ChevronLeft className="h-[18px] w-[18px]" /></Link>
          <span className="font-display font-semibold text-ink text-sm md:text-base">{lead.name}</span>
        </div>
        <LeadStatusBadge status={lead.status} />
      </header>
      <div className="flex-1 md:flex md:overflow-hidden">
        <aside className="hidden md:block w-64 shrink-0 border-r border-border bg-surface overflow-y-auto p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="h-16 w-16 text-xl mb-3"><AvatarFallback>{lead.avatarInitial}</AvatarFallback></Avatar>
            <div className="font-display font-semibold text-ink">{lead.name}</div>
            <div className="text-xs text-faint mt-1">{lead.phone}</div>
          </div>
          <div className="text-center mb-6">
            <div className="font-display font-bold text-3xl text-ink">{lead.score}</div>
            <div className="text-xs text-green-dark font-medium mt-1 capitalize">{lead.intent} intent</div>
          </div>
          <div className="space-y-4 text-sm">
            <Field label="Source" value={lead.source} capitalize />
            <Field label="Campaign" value={lead.campaign ?? "—"} />
            <Field label="First contact" value={lead.firstContactAt} />
            <Field label="Status" value={lead.status} capitalize />
          </div>
          <div className="mt-8 pt-6 border-t border-border space-y-2">
            <Button className="w-full">Mark as Won</Button>
            <Button variant="outline" className="w-full">Mark as Lost</Button>
          </div>
        </aside>
        <section className="flex-1 flex flex-col border-r border-border overflow-y-auto">
          <div className="flex-1 px-5 md:px-8 py-6 space-y-4">
            {messages.map((m) => <MessageBubble key={m.id} message={m} />)}
          </div>
          <SuggestedReply initialText={suggestedReply} />
        </section>
        <aside className="md:w-72 shrink-0 bg-surface md:overflow-y-auto p-5 md:p-6">
          <h2 className="font-display font-semibold text-ink mb-4">Flume Intelligence</h2>
          <div className="bg-green-surface rounded-card p-4 mb-4">
            <div className="text-xs text-green-dark mb-1">Score</div>
            <div className="font-display font-bold text-3xl text-green-dark">{lead.score}</div>
            <div className="text-xs font-medium text-green-dark mt-1 uppercase">{lead.intent}</div>
          </div>
          <div className="space-y-4 text-sm">
            <Field label="Intent" value={lead.intent === "high" ? "Strong" : lead.intent === "medium" ? "Moderate" : "Weak"} />
            <Field label="Reason" value={lead.reason ?? "—"} />
            <Field label="Budget signal" value={lead.budgetSignal ?? "—"} />
            <Field label="Urgency" value={lead.urgency ?? "—"} />
          </div>
          {lead.nextStep && (
            <div className="mt-6 pt-5 border-t border-border">
              <div className="text-xs text-faint mb-2">Suggested next step</div>
              <p className="text-sm text-ink leading-relaxed">{lead.nextStep}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
function Field({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div>
      <div className="text-xs text-faint mb-1">{label}</div>
      <div className={`text-ink font-medium ${capitalize ? "capitalize" : ""}`}>{value}</div>
    </div>
  );
}
