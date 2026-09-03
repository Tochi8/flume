import type { Campaign, Integration, QualificationConfig } from "@/types";

export const mockIntegrations: Integration[] = [
  { id: "int_whatsapp", name: "WhatsApp", description: "Reply to customers and send Piper's drafts", state: "connected", meta: "Adire & Co. Business · +234 80••••••00" },
  { id: "int_facebook", name: "Facebook", description: "Capture leads from Lead Ads and Messenger", state: "connected", meta: "Adire & Co. Page" },
  { id: "int_instagram", name: "Instagram", description: "Capture leads from DMs and comments", state: "connected", meta: "@adireandco" },
  { id: "int_tiktok", name: "TikTok", description: "Capture leads from TikTok Lead Generation ads", state: "not_connected" },
];

export const mockCampaigns: Campaign[] = [
  { id: "c1", name: "Event Chairs — Lagos", source: "facebook", sourceLabel: "Facebook · Lead Ads", leads: 58, spendNaira: 42000, status: "active" },
  { id: "c2", name: "Ramadan Furniture Sale", source: "facebook", sourceLabel: "Facebook · Lead Ads", leads: 34, spendNaira: 25500, status: "active" },
  { id: "c3", name: "Office Chairs Promo", source: "tiktok", sourceLabel: "TikTok · Lead Generation", leads: 21, spendNaira: 18200, status: "active" },
  { id: "c4", name: "Valentine Bundle", source: "facebook", sourceLabel: "Facebook · Lead Ads", leads: 14, spendNaira: 9800, status: "paused" },
  { id: "c5", name: "New Year Clearance", source: "tiktok", sourceLabel: "TikTok · Lead Generation", leads: 0, spendNaira: 0, status: "ended" },
];

export const mockQualificationConfig: QualificationConfig = {
  behavior: "auto_qualify",
  questions: [
    { id: "q1", order: 1, prompt: "What service do you need?" },
    { id: "q2", order: 2, prompt: "When do you need it?" },
    { id: "q3", order: 3, prompt: "What's your budget?" },
  ],
};
