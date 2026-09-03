const FREE_LIMIT = 50;
const PRO_LIMIT = 1000;

const state = {
  tenant: {
    id: "ten_demo",
    name: "Demo workspace",
    plan: "free",
    extractLimit: FREE_LIMIT,
    extractsUsed: 3,
    timezone: "Africa/Lagos",
    bachsCustomerId: null,
    bachsSubscriptionId: null,
  },
  leads: [
    {
      id: "ld_1",
      name: "Adaeze Okonkwo",
      phoneE164: "+2348031112222",
      source: "tiktok_form",
      campaign: "Catering — Lekki",
      score: 86,
      band: "high",
      reasons: ["valid phone", "intent: book", "source boost"],
      status: "new",
      extractedAt: "2026-09-03T03:12:00.000Z",
      draft: "Hi Adaeze — thanks for the TikTok form. We have Saturday slots in Lekki. What date works?",
    },
    {
      id: "ld_2",
      name: "Ibrahim Musa",
      phoneE164: "+2348095550101",
      source: "meta_lead",
      campaign: "Clinic consult",
      score: 61,
      band: "medium",
      reasons: ["valid phone", "form complete"],
      status: "qualified",
      extractedAt: "2026-09-02T16:40:00.000Z",
      draft: "Hi Ibrahim — we received your clinic form. Are you booking for yourself or a family member?",
    },
    {
      id: "ld_3",
      name: "Titi Adeyemi",
      phoneE164: "+2347012003004",
      source: "click_to_whatsapp",
      campaign: "Courier same-day",
      score: 44,
      band: "low",
      reasons: ["valid phone", "thin form"],
      status: "contacted",
      extractedAt: "2026-09-01T10:02:00.000Z",
      draft: "Hi Titi — pickup in Yaba today is still open until 4pm.",
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

export function updateLead(id, patch) {
  const lead = state.leads.find((item) => item.id === id);
  if (!lead) return null;
  Object.assign(lead, patch);
  return lead;
}

export function addLead(lead) {
  state.leads.unshift(lead);
  state.tenant.extractsUsed += 1;
  return lead;
}
