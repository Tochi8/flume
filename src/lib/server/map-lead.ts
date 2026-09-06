import type { Lead, LeadIntent, LeadSource, LeadStatus, Message } from "@/types";

type StoreLead = {
  id: string;
  name: string;
  phoneE164: string;
  source?: string;
  campaign?: string;
  score?: number;
  band?: string;
  intent?: string;
  reasons?: string[];
  status?: string;
  excerpt?: string;
  extractedAt?: string;
  extractedAtIso?: string | null;
  draft?: string;
  costNgn?: number;
};

function mapSource(source: string): LeadSource {
  const s = (source || "").toLowerCase();
  if (s.includes("tiktok")) return "tiktok";
  if (s.includes("instagram")) return "instagram";
  if (s.includes("whatsapp") || s.includes("click")) return "whatsapp";
  return "facebook";
}

function mapIntentBand(band: string): LeadIntent {
  if (band === "high" || band === "medium" || band === "low") return band;
  return "low";
}

function mapStatus(status: string): LeadStatus {
  const allowed: LeadStatus[] = ["new", "qualified", "contacted", "won", "lost", "junk"];
  return (allowed.includes(status as LeadStatus) ? status : "new") as LeadStatus;
}

/** Map Postgres/store lead shape → UI Lead type. */
export function toUiLead(lead: StoreLead): Lead {
  const reasonParts = [
    lead.intent ? `Intent: ${lead.intent}` : null,
    ...(lead.reasons || []),
  ].filter(Boolean);
  return {
    id: lead.id,
    name: lead.name || "Unknown",
    phone: lead.phoneE164,
    avatarInitial: (lead.name || "?").charAt(0).toUpperCase(),
    score: lead.score ?? 0,
    intent: mapIntentBand(lead.band || "low"),
    status: mapStatus(lead.status || "new"),
    source: mapSource(lead.source || ""),
    campaign: lead.campaign || undefined,
    lastMessage: lead.excerpt || "",
    lastMessageAt: lead.extractedAt || "",
    firstContactAt: lead.extractedAt || "",
    reason: reasonParts.join(" · ") || undefined,
    nextStep: lead.draft ? "Review suggested reply and send." : undefined,
  };
}

type StoreMessage = {
  id: string;
  leadId: string;
  from: string;
  body: string;
  sentAt: string;
};

export function toUiMessages(rows: StoreMessage[], leadId: string): Message[] {
  return rows.map((m) => ({
    id: m.id,
    leadId,
    from: m.from === "agent" ? "agent" : "lead",
    body: m.body,
    sentAt: formatClock(m.sentAt),
  }));
}

function formatClock(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
