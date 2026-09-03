import { Badge } from "@/components/ui/badge";
import type { Lead, LeadIntent, LeadStatus as LeadStatusType, LeadSource as LeadSourceType } from "@/types";

const intentCopy: Record<LeadIntent, { label: string; className: string }> = {
  high: { label: "High intent", className: "text-green-dark" },
  medium: { label: "Medium intent", className: "text-warning" },
  low: { label: "Low intent", className: "text-sub" },
};
export function LeadIntentLabel({ intent }: { intent: LeadIntent }) {
  const c = intentCopy[intent];
  return <span className={`text-xs font-medium ${c.className}`}>{c.label}</span>;
}
export function LeadScore({ score, intent }: { score: number; intent: LeadIntent }) {
  const variant = intent === "high" ? "success" : intent === "medium" ? "warning" : "default";
  return <Badge variant={variant}>Score {score}</Badge>;
}
const statusCopy: Record<LeadStatusType, { label: string; variant: "success" | "info" | "default" | "outline" }> = {
  new: { label: "New", variant: "default" },
  qualified: { label: "Qualified", variant: "success" },
  contacted: { label: "Contacted", variant: "info" },
  won: { label: "Won", variant: "success" },
  lost: { label: "Lost", variant: "outline" },
  junk: { label: "Junk", variant: "outline" },
};
export function LeadStatusBadge({ status }: { status: LeadStatusType }) {
  const c = statusCopy[status];
  return <Badge variant={c.variant}>{c.label}</Badge>;
}
const sourceCopy: Record<LeadSourceType, string> = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", whatsapp: "WhatsApp" };
export function LeadSourceLabel({ source }: { source: LeadSourceType }) {
  return <span>{sourceCopy[source]}</span>;
}
export function leadStatusLabel(status: Lead["status"]) {
  return statusCopy[status].label;
}
