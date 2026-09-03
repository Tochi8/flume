import type { Lead, Message } from "@/types";

export const mockLeads: Lead[] = [
  { id: "lead_1", name: "Adebayo Ogundimu", phone: "+234 80••••••12", avatarInitial: "A", score: 92, intent: "high", status: "qualified", source: "facebook", campaign: "Event Chairs — Lagos", lastMessage: "A wedding reception. How much for 20 chairs, delivered Saturday?", lastMessageAt: "4 min ago", firstContactAt: "Today, 9:14 AM", reason: "Event purchase, fixed date, quantity specified", budgetSignal: "Not yet mentioned", urgency: "High — event is 3 days away", nextStep: "Send pricing and confirm delivery for Saturday before end of day." },
  { id: "lead_2", name: "Chiamaka Eze", phone: "+234 70••••••45", avatarInitial: "C", score: 76, intent: "medium", status: "contacted", source: "facebook", campaign: "Ramadan Furniture Sale", lastMessage: "Do you deliver to Lekki Phase 1? Looking for a monthly supply.", lastMessageAt: "22 min ago", firstContactAt: "Today, 8:40 AM", reason: "Recurring order signal, no fixed date yet", budgetSignal: "Not yet mentioned", urgency: "Medium", nextStep: "Confirm delivery area and ask about order frequency." },
  { id: "lead_3", name: "Emeka Nwosu", phone: "+234 90••••••78", avatarInitial: "E", score: 58, intent: "low", status: "new", source: "tiktok", campaign: "Office Chairs Promo", lastMessage: "How much is the small size?", lastMessageAt: "1 hr ago", firstContactAt: "Today, 7:55 AM", reason: "Single price question, no timeline", budgetSignal: "Not mentioned", urgency: "Low", nextStep: "Reply with pricing and ask what he needs it for." },
  { id: "lead_4", name: "Funmilayo Adeyemi", phone: "+234 81••••••33", avatarInitial: "F", score: 88, intent: "high", status: "won", source: "facebook", campaign: "Event Chairs — Lagos", lastMessage: "Perfect, that works. Let's go ahead.", lastMessageAt: "Yesterday", firstContactAt: "Yesterday, 2:10 PM", reason: "Confirmed order", budgetSignal: "Confirmed ₦120,000", urgency: "Resolved", nextStep: "Send invoice and delivery confirmation." },
];

export const mockMessages: Record<string, Message[]> = {
  lead_1: [
    { id: "m1", leadId: "lead_1", from: "lead", body: "Hi, I saw your chairs on Facebook.", sentAt: "9:14 AM" },
    { id: "m2", leadId: "lead_1", from: "lead", body: "I need 20 chairs for an event next Saturday.", sentAt: "9:15 AM" },
    { id: "m3", leadId: "lead_1", from: "agent", body: "Hi Adebayo! Happy to help — what kind of event is it?", sentAt: "9:20 AM" },
    { id: "m4", leadId: "lead_1", from: "lead", body: "A wedding reception. How much for 20 chairs, delivered Saturday?", sentAt: "9:31 AM" },
  ],
};

export function getLeadById(id: string): Lead | undefined {
  return mockLeads.find((l) => l.id === id);
}
