export type { Lead, Message, LeadStatus, LeadIntent, LeadSource } from "./lead";

export interface QualificationQuestion {
  id: string;
  order: number;
  prompt: string;
}

export type QualificationBotBehavior = "auto_qualify" | "hand_off";

export interface QualificationConfig {
  questions: QualificationQuestion[];
  behavior: QualificationBotBehavior;
}

export type ConnectionState = "connected" | "not_connected";

export interface Integration {
  id: string;
  name: string;
  description: string;
  state: ConnectionState;
  meta?: string;
}

export type CampaignStatus = "active" | "paused" | "ended";

export interface Campaign {
  id: string;
  name: string;
  source: "facebook" | "tiktok";
  sourceLabel: string;
  leads: number;
  spendNaira: number;
  status: CampaignStatus;
}

export interface Workspace {
  id: string;
  name: string;
  planLeadsUsed: number;
  planLeadsLimit: number;
}
