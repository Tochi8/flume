import { monthKey, canExtract } from "./quota.js";
import { hasSupabaseAdmin, supabaseAdmin } from "./supabase.js";

export const FREE_LIMIT = 50;
export const PRO_LIMIT = 1000;
export const DEMO_TENANT_ID =
  process.env.FLUME_DEMO_TENANT_ID || "11111111-1111-1111-1111-111111111111";

function planLimit(plan) {
  return plan === "free" ? FREE_LIMIT : PRO_LIMIT;
}

function normalizePlan(plan) {
  if (plan === "pro" || plan === "pro_month" || plan === "pro_year") return plan === "pro" ? "pro_month" : plan;
  return "free";
}

/** Mask +2348011111112 → +234 80••••••12 */
export function maskPhone(phone) {
  if (!phone) return "";
  const raw = String(phone).replace(/\s+/g, "");
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 6) return raw;
  const country = digits.startsWith("234") ? "+234" : raw.startsWith("+") ? `+${digits.slice(0, digits.length - 10)}` : "";
  const national = digits.startsWith("234") ? digits.slice(3) : digits;
  const head = national.slice(0, 2);
  const tail = national.slice(-2);
  const prefix = country || (raw.startsWith("+") ? "" : "");
  return `${prefix} ${head}••••••${tail}`.trim();
}

function relativeTime(iso, timeZone = "Africa/Lagos") {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return String(iso);
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      day: "numeric",
      month: "short",
    }).format(new Date(iso));
  } catch {
    return `${days}d ago`;
  }
}

function mapLeadRow(row, { mask = true, timeZone = "Africa/Lagos" } = {}) {
  if (!row) return null;
  const phone = row.phone_e164 || "";
  return {
    id: row.id,
    name: row.name || "Unknown",
    phoneE164: mask ? maskPhone(phone) : phone,
    phoneRaw: phone,
    source: row.source || "",
    campaign: row.campaign_id || "",
    score: row.score ?? 0,
    band: row.band || "low",
    intent: row.intent || "",
    reasons: Array.isArray(row.score_reasons) ? row.score_reasons : [],
    status: row.status || "new",
    excerpt: row.excerpt || "",
    extractedAt: relativeTime(row.extracted_at, timeZone),
    extractedAtIso: row.extracted_at,
    lastSeenAtIso: row.last_seen_at,
    draft: row.draft || "",
    costNgn: row.cost_ngn ?? 10,
  };
}

const FALLBACK_TENANT = {
  id: DEMO_TENANT_ID,
  name: "Tolu",
  workspace: "Lekki Events",
  plan: "free",
  extractLimit: FREE_LIMIT,
  extractsUsed: 43,
  timezone: "Africa/Lagos",
  yyyymm: monthKey(),
  notificationEmail: "",
  ownerName: "Tolu",
  bachsCustomerId: null,
};

const FALLBACK_LEADS = [
  {
    id: "ed67441c-051e-478d-ae4e-bca60eb4ff62",
    name: "Adebayo",
    phoneE164: maskPhone("+2348011111112"),
    phoneRaw: "+2348011111112",
    source: "Facebook",
    campaign: "Event chairs",
    score: 92,
    band: "high",
    intent: "Event purchase",
    reasons: ["valid phone", "intent: event", "source boost"],
    status: "qualified",
    excerpt: "I need 20 chairs for an event next Saturday.",
    extractedAt: "4 min ago",
    extractedAtIso: null,
    lastSeenAtIso: null,
    draft:
      "Hi Adebayo, thanks for reaching out. We can help with the 20 chairs for your event next Saturday. Would you like our available options and pricing?",
    costNgn: 10,
  },
  {
    id: "12a4bcbf-5e33-4d39-a3d9-5c51929d7146",
    name: "Chiamaka",
    phoneE164: maskPhone("+2348111111109"),
    phoneRaw: "+2348111111109",
    source: "TikTok",
    campaign: "Catering Lekki",
    score: 76,
    band: "medium",
    intent: "Booking",
    reasons: ["valid phone", "form complete"],
    status: "contacted",
    excerpt: "Do you cook for 40 people on Sunday?",
    extractedAt: "1 hr ago",
    extractedAtIso: null,
    lastSeenAtIso: null,
    draft: "Hi Chiamaka — Sunday is open. What time should we arrive in Lekki?",
    costNgn: 10,
  },
  {
    id: "3979f1f4-442d-41c4-bfd9-44aeef672925",
    name: "Ibrahim",
    phoneE164: maskPhone("+2347011111101"),
    phoneRaw: "+2347011111101",
    source: "Click-to-WhatsApp",
    campaign: "Clinic consult",
    score: 54,
    band: "low",
    intent: "Info",
    reasons: ["valid phone", "thin form"],
    status: "new",
    excerpt: "How much is a consult?",
    extractedAt: "Yesterday",
    extractedAtIso: null,
    lastSeenAtIso: null,
    draft: "Hi Ibrahim — consults start at ₦15,000. Are you booking for yourself?",
    costNgn: 10,
  },
];

const DEFAULT_QUALIFICATION = {
  behavior: "auto_qualify",
  questions: [
    { id: "q1", order: 1, prompt: "What service do you need?" },
    { id: "q2", order: 2, prompt: "When do you need it?" },
    { id: "q3", order: 3, prompt: "What's your budget?" },
  ],
};

const DEFAULT_CAMPAIGNS = [
  { name: "Event Chairs — Lagos", source: "facebook", sourceLabel: "Facebook · Lead Ads", leads: 58, spendNaira: 42000, status: "active" },
  { name: "Ramadan Furniture Sale", source: "facebook", sourceLabel: "Facebook · Lead Ads", leads: 34, spendNaira: 25500, status: "active" },
  { name: "Office Chairs Promo", source: "tiktok", sourceLabel: "TikTok · Lead Generation", leads: 21, spendNaira: 18200, status: "active" },
  { name: "Valentine Bundle", source: "facebook", sourceLabel: "Facebook · Lead Ads", leads: 14, spendNaira: 9800, status: "paused" },
  { name: "New Year Clearance", source: "tiktok", sourceLabel: "TikTok · Lead Generation", leads: 0, spendNaira: 0, status: "ended" },
];

const INTEGRATION_CATALOG = [
  { kind: "whatsapp", id: "int_whatsapp", name: "WhatsApp", description: "Reply to customers and send Piper's drafts" },
  { kind: "facebook", id: "int_facebook", name: "Facebook", description: "Capture leads from Lead Ads and Messenger" },
  { kind: "instagram", id: "int_instagram", name: "Instagram", description: "Capture leads from DMs and comments" },
  { kind: "tiktok", id: "int_tiktok", name: "TikTok", description: "Capture leads from TikTok Lead Generation ads" },
];

function mapKindFromLegacy(kind) {
  if (kind === "meta_page") return "facebook";
  return kind;
}

export async function getUserByAuthId(authUserId) {
  if (!authUserId) return null;
  if (!hasSupabaseAdmin()) return null;
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("users")
    .select("id, tenant_id, email, name, role, auth_user_id")
    .eq("auth_user_id", authUserId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    tenantId: data.tenant_id,
    email: data.email,
    name: data.name,
    role: data.role,
    authUserId: data.auth_user_id,
  };
}

export async function getTenant(tenantId = DEMO_TENANT_ID) {
  if (!hasSupabaseAdmin()) {
    return { ...FALLBACK_TENANT, canExtract: canExtract(FALLBACK_TENANT), source: "fallback" };
  }
  const db = supabaseAdmin();
  const { data: tenant, error } = await db.from("tenants").select("*").eq("id", tenantId).maybeSingle();
  if (error) throw error;
  if (!tenant) {
    return { ...FALLBACK_TENANT, canExtract: canExtract(FALLBACK_TENANT), source: "fallback" };
  }
  const tz = tenant.timezone || "Africa/Lagos";
  const yyyymm = monthKey(new Date(), tz);
  const { data: usage } = await db
    .from("usage_months")
    .select("extracts_used, yyyymm")
    .eq("tenant_id", tenantId)
    .eq("yyyymm", yyyymm)
    .maybeSingle();

  const { data: owner } = await db
    .from("users")
    .select("email, name")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const shaped = {
    id: tenant.id,
    name: tenant.name,
    workspace: tenant.workspace || "",
    plan: tenant.plan === "pro_month" || tenant.plan === "pro_year" ? tenant.plan : "free",
    extractLimit: tenant.extract_limit ?? planLimit(tenant.plan),
    extractsUsed: usage?.extracts_used ?? 0,
    timezone: tz,
    yyyymm,
    bachsCustomerId: tenant.bachs_customer_id || null,
    notificationEmail: owner?.email || "",
    ownerName: owner?.name || tenant.name,
    source: "supabase",
  };
  shaped.canExtract = canExtract(shaped);
  return shaped;
}

export async function updateTenantSettings(tenantId, { workspace, name, notificationEmail } = {}) {
  if (!hasSupabaseAdmin()) {
    return getTenant(tenantId);
  }
  const db = supabaseAdmin();
  const tenantPatch = {};
  if (workspace != null) tenantPatch.workspace = workspace;
  if (name != null) tenantPatch.name = name;
  if (Object.keys(tenantPatch).length) {
    const { error } = await db.from("tenants").update(tenantPatch).eq("id", tenantId);
    if (error) throw error;
  }
  if (notificationEmail != null) {
    const { data: owner } = await db
      .from("users")
      .select("id")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (owner?.id) {
      const { error } = await db.from("users").update({ email: notificationEmail }).eq("id", owner.id);
      if (error) throw error;
    }
  }
  return getTenant(tenantId);
}

export async function setPlan(plan, tenantId = DEMO_TENANT_ID) {
  const normalized = normalizePlan(plan);
  const extractLimit = planLimit(normalized === "free" ? "free" : "pro");
  if (!hasSupabaseAdmin()) {
    return {
      ...FALLBACK_TENANT,
      plan: normalized === "free" ? "free" : normalized,
      extractLimit,
      canExtract: canExtract({ ...FALLBACK_TENANT, extractLimit }),
      source: "fallback",
    };
  }
  const db = supabaseAdmin();
  const { error } = await db
    .from("tenants")
    .update({ plan: normalized === "free" ? "free" : normalized, extract_limit: extractLimit })
    .eq("id", tenantId);
  if (error) throw error;
  return getTenant(tenantId);
}

export async function listLeads(tenantId = DEMO_TENANT_ID, { mask = true } = {}) {
  if (!hasSupabaseAdmin()) {
    return FALLBACK_LEADS.map((l) => ({ ...l }));
  }
  const db = supabaseAdmin();
  const { data: tenant } = await db.from("tenants").select("timezone").eq("id", tenantId).maybeSingle();
  const timeZone = tenant?.timezone || "Africa/Lagos";
  const { data, error } = await db
    .from("leads")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("extracted_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => mapLeadRow(row, { mask, timeZone })).filter(Boolean);
}

export async function getLead(id, tenantId = DEMO_TENANT_ID, { mask = true } = {}) {
  if (!id) return null;
  if (!hasSupabaseAdmin()) {
    return FALLBACK_LEADS.find((l) => l.id === id) || null;
  }
  const db = supabaseAdmin();
  const { data: tenant } = await db.from("tenants").select("timezone").eq("id", tenantId).maybeSingle();
  const timeZone = tenant?.timezone || "Africa/Lagos";
  let query = db.from("leads").select("*").eq("id", id);
  if (tenantId) query = query.eq("tenant_id", tenantId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return mapLeadRow(data, { mask, timeZone });
}

export async function updateLead(id, patch, tenantId = DEMO_TENANT_ID) {
  if (!hasSupabaseAdmin()) {
    const lead = FALLBACK_LEADS.find((l) => l.id === id);
    if (!lead) return null;
    Object.assign(lead, patch);
    return { ...lead };
  }
  const db = supabaseAdmin();
  const allowed = {};
  if (patch.status != null) allowed.status = patch.status;
  if (patch.name != null) allowed.name = patch.name;
  if (patch.draft != null) allowed.draft = patch.draft;
  if (patch.excerpt != null) allowed.excerpt = patch.excerpt;
  if (patch.score != null) allowed.score = patch.score;
  if (patch.band != null) allowed.band = patch.band;
  if (patch.intent != null) allowed.intent = patch.intent;
  if (patch.campaign != null) allowed.campaign_id = patch.campaign;
  if (patch.campaign_id != null) allowed.campaign_id = patch.campaign_id;
  if (patch.reasons != null) allowed.score_reasons = patch.reasons;
  if (patch.score_reasons != null) allowed.score_reasons = patch.score_reasons;
  if (patch.phoneE164 != null) allowed.phone_e164 = patch.phoneE164;
  if (patch.phone_e164 != null) allowed.phone_e164 = patch.phone_e164;
  allowed.last_seen_at = new Date().toISOString();

  const { data, error } = await db
    .from("leads")
    .update(allowed)
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { data: tenant } = await db.from("tenants").select("timezone").eq("id", tenantId).maybeSingle();
  return mapLeadRow(data, { mask: true, timeZone: tenant?.timezone || "Africa/Lagos" });
}

export async function listConversations(leadId) {
  if (!hasSupabaseAdmin()) return [];
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("conversations")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map((row) => ({
    id: row.id,
    leadId: row.lead_id,
    from: row.direction === "out" ? "agent" : "lead",
    body: row.body,
    sentAt: row.created_at,
    waMessageId: row.wa_message_id,
  }));
}

export async function addOutboundMessage(leadId, body, tenantId) {
  if (!hasSupabaseAdmin()) {
    return { id: `local_${Date.now()}`, leadId, from: "agent", body, sentAt: new Date().toISOString() };
  }
  const db = supabaseAdmin();
  // Ensure lead belongs to tenant
  const { data: lead } = await db.from("leads").select("id").eq("id", leadId).eq("tenant_id", tenantId).maybeSingle();
  if (!lead) return null;
  const { data, error } = await db
    .from("conversations")
    .insert({ lead_id: leadId, direction: "out", body })
    .select("*")
    .maybeSingle();
  if (error) throw error;
  await db
    .from("leads")
    .update({ status: "contacted", last_seen_at: new Date().toISOString(), draft: body })
    .eq("id", leadId)
    .eq("tenant_id", tenantId);
  return {
    id: data.id,
    leadId: data.lead_id,
    from: "agent",
    body: data.body,
    sentAt: data.created_at,
  };
}

export async function listConnections(tenantId) {
  const catalog = INTEGRATION_CATALOG.map((c) => ({
    ...c,
    state: "not_connected",
    meta: undefined,
    dbId: null,
  }));
  if (!hasSupabaseAdmin()) return catalog.map(toIntegration);
  const db = supabaseAdmin();
  const { data, error } = await db.from("connections").select("*").eq("tenant_id", tenantId);
  if (error) throw error;
  const byKind = new Map();
  for (const row of data || []) {
    const kind = mapKindFromLegacy(row.kind);
    byKind.set(kind, row);
  }
  return catalog.map((c) => {
    const row = byKind.get(c.kind);
    return toIntegration({
      ...c,
      state: row?.status === "connected" ? "connected" : "not_connected",
      meta: row?.external_id || undefined,
      dbId: row?.id || null,
    });
  });
}

function toIntegration(item) {
  return {
    id: item.id,
    kind: item.kind,
    name: item.name,
    description: item.description,
    state: item.state,
    meta: item.meta,
    dbId: item.dbId,
  };
}

export async function setConnectionStatus(tenantId, kind, { connected, externalId } = {}) {
  const normalized = kind === "meta_page" ? "facebook" : kind;
  if (!hasSupabaseAdmin()) {
    return listConnections(tenantId);
  }
  const db = supabaseAdmin();
  const status = connected ? "connected" : "disconnected";
  const { data: existing } = await db
    .from("connections")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("kind", normalized)
    .maybeSingle();

  // Fall back to meta_page for facebook if constraint rejects facebook
  let writeKind = normalized;
  if (existing?.id) {
    const { error } = await db
      .from("connections")
      .update({ status, external_id: externalId ?? null })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    let { error } = await db.from("connections").insert({
      tenant_id: tenantId,
      kind: writeKind,
      status,
      external_id: externalId ?? null,
    });
    if (error && (error.code === "23514" || /kind/i.test(error.message || ""))) {
      writeKind = normalized === "facebook" || normalized === "instagram" ? "meta_page" : normalized;
      ({ error } = await db.from("connections").insert({
        tenant_id: tenantId,
        kind: writeKind,
        status,
        external_id: externalId || normalized,
      }));
    }
    if (error) throw error;
  }
  return listConnections(tenantId);
}

export async function listCampaigns(tenantId) {
  if (!hasSupabaseAdmin()) {
    return DEFAULT_CAMPAIGNS.map((c, i) => ({ id: `c${i + 1}`, ...c }));
  }
  const db = supabaseAdmin();
  const { data, error } = await db.from("campaigns").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: true });
  if (!error && data) {
    if (data.length === 0 && tenantId === DEMO_TENANT_ID) {
      await seedDemoCampaigns(tenantId);
      const { data: seeded } = await db.from("campaigns").select("*").eq("tenant_id", tenantId);
      return (seeded || []).map(mapCampaignRow);
    }
    if (data.length === 0) {
      // Derive from leads for new tenants
      return deriveCampaignsFromLeads(tenantId);
    }
    return data.map(mapCampaignRow);
  }
  // Table missing — derive from leads
  return deriveCampaignsFromLeads(tenantId);
}

function mapCampaignRow(row) {
  return {
    id: row.id,
    name: row.name,
    source: row.source === "tiktok" ? "tiktok" : "facebook",
    sourceLabel: row.source_label || (row.source === "tiktok" ? "TikTok · Lead Generation" : "Facebook · Lead Ads"),
    leads: row.leads_count ?? row.leads ?? 0,
    spendNaira: row.spend_ngn ?? row.spend_naira ?? 0,
    status: row.status || "active",
  };
}

async function deriveCampaignsFromLeads(tenantId) {
  const leads = await listLeads(tenantId, { mask: true });
  const map = new Map();
  for (const lead of leads) {
    const key = lead.campaign || "Organic / Direct";
    if (!map.has(key)) {
      const src = (lead.source || "").toLowerCase().includes("tiktok") ? "tiktok" : "facebook";
      map.set(key, {
        id: `derived_${key.replace(/\W+/g, "_").toLowerCase()}`,
        name: key,
        source: src,
        sourceLabel: src === "tiktok" ? "TikTok · Lead Generation" : "Facebook · Lead Ads",
        leads: 0,
        spendNaira: 0,
        status: "active",
      });
    }
    map.get(key).leads += 1;
  }
  const rows = [...map.values()];
  return rows.length ? rows : [];
}

async function seedDemoCampaigns(tenantId) {
  const db = supabaseAdmin();
  const rows = DEFAULT_CAMPAIGNS.map((c) => ({
    tenant_id: tenantId,
    name: c.name,
    source: c.source,
    source_label: c.sourceLabel,
    leads_count: c.leads,
    spend_ngn: c.spendNaira,
    status: c.status,
  }));
  await db.from("campaigns").insert(rows);
}

export async function getQualificationConfig(tenantId) {
  if (!hasSupabaseAdmin()) return { ...DEFAULT_QUALIFICATION };
  const db = supabaseAdmin();
  const { data, error } = await db.from("qualification_configs").select("*").eq("tenant_id", tenantId).maybeSingle();
  if (!error && data) {
    return {
      behavior: data.behavior || "auto_qualify",
      questions: Array.isArray(data.questions) ? data.questions : DEFAULT_QUALIFICATION.questions,
    };
  }
  // Fallback: tenants.settings.qualification if column exists
  const { data: tenant, error: te } = await db.from("tenants").select("*").eq("id", tenantId).maybeSingle();
  if (!te && tenant?.settings?.qualification) {
    return tenant.settings.qualification;
  }
  return { ...DEFAULT_QUALIFICATION, questions: DEFAULT_QUALIFICATION.questions.map((q) => ({ ...q })) };
}

export async function saveQualificationConfig(tenantId, config) {
  const payload = {
    behavior: config.behavior === "hand_off" ? "hand_off" : "auto_qualify",
    questions: Array.isArray(config.questions) ? config.questions : [],
  };
  if (!hasSupabaseAdmin()) return payload;
  const db = supabaseAdmin();
  const { error } = await db.from("qualification_configs").upsert({
    tenant_id: tenantId,
    behavior: payload.behavior,
    questions: payload.questions,
    updated_at: new Date().toISOString(),
  });
  if (!error) return payload;

  // Fallback to tenants.settings jsonb when table missing
  const { data: tenant } = await db.from("tenants").select("*").eq("id", tenantId).maybeSingle();
  const settings = { ...(tenant?.settings || {}), qualification: payload };
  const { error: te } = await db.from("tenants").update({ settings }).eq("id", tenantId);
  if (te) {
    const err = new Error(
      "qualification_configs table (or tenants.settings) missing — apply supabase/migrations/20260906_auth_desk.sql"
    );
    err.code = "migration_required";
    throw err;
  }
  return payload;
}

export async function listThreadsNeedingReply(tenantId) {
  const leads = await listLeads(tenantId);
  return leads.filter((l) => l.status === "new" || l.status === "contacted" || l.status === "qualified");
}
