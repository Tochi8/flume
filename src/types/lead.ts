export type LeadStatus =
  | "new"
  | "qualified"
  | "contacted"
  | "won"
  | "lost"
  | "junk";

export type LeadIntent = "high" | "medium" | "low";

export type LeadSource = "facebook" | "instagram" | "tiktok" | "whatsapp";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  avatarInitial: string;
  score: number;
  intent: LeadIntent;
  status: LeadStatus;
  source: LeadSource;
  campaign?: string;
  lastMessage: string;
  lastMessageAt: string;
  firstContactAt: string;
  reason?: string;
  budgetSignal?: string;
  urgency?: string;
  nextStep?: string;
}

export interface Message {
  id: string;
  leadId: string;
  from: "lead" | "agent";
  body: string;
  sentAt: string;
}
