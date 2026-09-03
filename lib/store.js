const FREE_LIMIT = 50;
const PRO_LIMIT = 1000;

const state = {
  tenant: {
    id: "ten_demo",
    name: "Tolu",
    workspace: "Lekki Events",
    plan: "free",
    extractLimit: FREE_LIMIT,
    extractsUsed: 43,
    timezone: "Africa/Lagos",
  },
  leads: [
    {
      id: "ld_1",
      name: "Adebayo",
      phoneE164: "+234 80••••••12",
      source: "Facebook",
      campaign: "Event chairs",
      score: 92,
      band: "high",
      intent: "Event purchase",
      reasons: ["valid phone", "intent: event", "source boost"],
      status: "qualified",
      excerpt: "I need 20 chairs for an event next Saturday.",
      extractedAt: "4 min ago",
      draft:
        "Hi Adebayo, thanks for reaching out. We can help with the 20 chairs for your event next Saturday. Would you like our available options and pricing?",
      costNgn: 10,
    },
    {
      id: "ld_2",
      name: "Chiamaka",
      phoneE164: "+234 81••••••09",
      source: "TikTok",
      campaign: "Catering Lekki",
      score: 76,
      band: "medium",
      intent: "Booking",
      reasons: ["valid phone", "form complete"],
      status: "contacted",
      excerpt: "Do you cook for 40 people on Sunday?",
      extractedAt: "1 hr ago",
      draft: "Hi Chiamaka — Sunday is open. What time should we arrive in Lekki?",
      costNgn: 10,
    },
    {
      id: "ld_3",
      name: "Ibrahim",
      phoneE164: "+234 70••••••01",
      source: "Click-to-WhatsApp",
      campaign: "Clinic consult",
      score: 54,
      band: "low",
      intent: "Info",
      reasons: ["valid phone", "thin form"],
      status: "new",
      excerpt: "How much is a consult?",
      extractedAt: "Yesterday",
      draft: "Hi Ibrahim — consults start at ₦15,000. Are you booking for yourself?",
      costNgn: 10,
    },
  ],
};

export function getTenant() {
  return state.tenant;
}

export function setPlan(plan) {
  state.tenant.plan = plan;
  state.tenant.extractLimit = plan === "free" ? FREE_LIMIT : PRO_LIMIT;
  return state.tenant;
}

export function listLeads() {
  return state.leads;
}

export function getLead(id) {
  return state.leads.find((item) => item.id === id) || state.leads[0];
}

export function updateLead(id, patch) {
  const lead = state.leads.find((item) => item.id === id);
  if (!lead) return null;
  Object.assign(lead, patch);
  return lead;
}
