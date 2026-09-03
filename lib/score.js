const INTENT = /\b(price|book|order|today|now|how much|available)\b/i;

const SOURCE_WEIGHT = {
  click_to_whatsapp: 22,
  tiktok_im: 18,
  tiktok_form: 12,
  meta_lead: 10,
  csv: 4,
};

export function scoreLead(lead) {
  const reasons = [];
  if (!lead.phoneE164) {
    return { score: 0, band: "low", reasons: ["missing phone"] };
  }
  let score = 40;
  reasons.push("valid phone");

  const fields = [lead.name, lead.campaign, lead.firstMessage].filter(Boolean).length;
  if (fields >= 2) {
    score += 12;
    reasons.push("form complete");
  }

  const sourceBoost = SOURCE_WEIGHT[lead.source] || 0;
  if (sourceBoost) {
    score += sourceBoost;
    reasons.push("source boost");
  }

  if (lead.ingestedMs != null && lead.ingestedMs < 60_000) {
    score += 10;
    reasons.push("ingested under 60s");
  }

  const text = `${lead.firstMessage || ""} ${lead.campaign || ""}`;
  if (INTENT.test(text)) {
    score += 16;
    reasons.push("intent keyword");
  }

  if (lead.answeredQ1) {
    score += 10;
    reasons.push("bot reply");
  }

  score = Math.max(0, Math.min(100, score));
  const band = score >= 75 ? "high" : score >= 50 ? "medium" : "low";
  return { score, band, reasons };
}
