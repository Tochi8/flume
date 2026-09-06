import type { Lead, Message } from "@/types";

/** Legacy mock threads used when conversations table is empty. */
export const mockMessages: Record<string, Message[]> = {
  "ed67441c-051e-478d-ae4e-bca60eb4ff62": [
    { id: "m1", leadId: "ed67441c-051e-478d-ae4e-bca60eb4ff62", from: "lead", body: "Hi, I saw your chairs on Facebook.", sentAt: "9:14 AM" },
    { id: "m2", leadId: "ed67441c-051e-478d-ae4e-bca60eb4ff62", from: "lead", body: "I need 20 chairs for an event next Saturday.", sentAt: "9:15 AM" },
    { id: "m3", leadId: "ed67441c-051e-478d-ae4e-bca60eb4ff62", from: "agent", body: "Hi Adebayo! Happy to help — what kind of event is it?", sentAt: "9:20 AM" },
    { id: "m4", leadId: "ed67441c-051e-478d-ae4e-bca60eb4ff62", from: "lead", body: "A wedding reception. How much for 20 chairs, delivered Saturday?", sentAt: "9:31 AM" },
  ],
};

/** @deprecated Prefer listLeads() from lib/store.js via server components / API. */
export const mockLeads: Lead[] = [];

export function getMockMessages(leadId: string): Message[] {
  return mockMessages[leadId] ?? [];
}
