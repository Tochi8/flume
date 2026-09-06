import { createHmac, timingSafeEqual } from "crypto";

export const TIKTOK_API_BASE =
  process.env.TIKTOK_API_BASE || "https://business-api.tiktok.com";

/**
 * TikTok webhook / Instant Form subscription payload shapes vary.
 * Common notify fields: lead_id, advertiser_id, page_id, campaign_id, ad_id.
 * Developer-portal style wraps details in a stringified `content` field.
 */
export function parseTikTokLeadNotify(payload) {
  if (!payload || typeof payload !== "object") return null;

  let root = payload;
  if (typeof payload.content === "string") {
    try {
      const nested = JSON.parse(payload.content);
      root = { ...payload, ...nested };
    } catch {
      /* keep root */
    }
  } else if (payload.content && typeof payload.content === "object") {
    root = { ...payload, ...payload.content };
  }

  const entry = Array.isArray(root.entry)
    ? root.entry[0]
    : Array.isArray(root.data)
      ? root.data[0]
      : root.data && typeof root.data === "object"
        ? root.data
        : root;

  const leadId =
    entry?.lead_id ||
    entry?.leadId ||
    root.lead_id ||
    root.leadId ||
    entry?.id ||
    null;
  if (!leadId) return null;

  return {
    leadId: String(leadId),
    advertiserId: String(
      entry?.advertiser_id ||
        entry?.advertiserId ||
        root.advertiser_id ||
        root.advertiserId ||
        process.env.TIKTOK_ADVERTISER_ID ||
        ""
    ),
    pageId: String(entry?.page_id || entry?.pageId || root.page_id || root.pageId || ""),
    campaignId: String(
      entry?.campaign_id || entry?.campaignId || root.campaign_id || root.campaignId || ""
    ),
    campaignName: String(
      entry?.campaign_name || entry?.campaignName || root.campaign_name || root.campaignName || ""
    ),
    adgroupId: String(entry?.adgroup_id || entry?.adgroupId || root.adgroup_id || ""),
    adId: String(entry?.ad_id || entry?.adId || root.ad_id || ""),
    createTime: entry?.create_time || entry?.submit_time || root.create_time || root.submit_time || null,
    event: root.event || payload.event || "LEAD",
    raw: payload,
  };
}

/**
 * Verify TikTok-Signature: `t=<unix>,s=<hex>`
 * HMAC-SHA256(client_secret, `${t}.${rawBody}`), constant-time compare.
 * Docs: https://developers.tiktok.com/doc/webhooks-verification
 *
 * Fallback: when no TikTok-Signature header is present, accept
 * `X-TikTok-Webhook-Secret` or `X-Flume-TikTok-Secret` matching TIKTOK_CLIENT_SECRET
 * (Subscription API deliveries sometimes omit HMAC — shared secret header for partners).
 */
export function verifyTikTokWebhookSignature(rawBody, headers, clientSecret) {
  if (!clientSecret) {
    return { ok: false, reason: "secret_missing" };
  }

  const headerBag =
    headers.get?.("tiktok-signature") ||
    headers.get?.("TikTok-Signature") ||
    headers["tiktok-signature"] ||
    headers["TikTok-Signature"] ||
    "";

  if (headerBag) {
    const parts = Object.fromEntries(
      String(headerBag)
        .split(",")
        .map((p) => p.trim().split("="))
        .filter((kv) => kv.length === 2)
        .map(([k, v]) => [k.trim(), v.trim()])
    );
    const t = parts.t;
    const s = parts.s;
    if (!t || !s) return { ok: false, reason: "malformed_signature" };

    const ageSec = Math.abs(Math.floor(Date.now() / 1000) - Number(t));
    if (Number.isFinite(ageSec) && ageSec > 10 * 60) {
      return { ok: false, reason: "stale_timestamp" };
    }

    const expected = createHmac("sha256", clientSecret)
      .update(`${t}.${rawBody}`)
      .digest("hex");
    try {
      const a = Buffer.from(expected, "utf8");
      const b = Buffer.from(s, "utf8");
      if (a.length !== b.length || !timingSafeEqual(a, b)) {
        return { ok: false, reason: "bad_signature" };
      }
    } catch {
      return { ok: false, reason: "bad_signature" };
    }
    return { ok: true, method: "tiktok-signature" };
  }

  const shared =
    headers.get?.("x-tiktok-webhook-secret") ||
    headers.get?.("x-flume-tiktok-secret") ||
    headers["x-tiktok-webhook-secret"] ||
    headers["x-flume-tiktok-secret"] ||
    "";
  if (shared) {
    try {
      const a = Buffer.from(String(shared), "utf8");
      const b = Buffer.from(String(clientSecret), "utf8");
      if (a.length === b.length && timingSafeEqual(a, b)) {
        return { ok: true, method: "shared_secret_header" };
      }
    } catch {
      /* fall through */
    }
    return { ok: false, reason: "bad_shared_secret" };
  }

  // No signature header: allow only when explicitly opted in (local/dev / partner without sig).
  if (process.env.TIKTOK_WEBHOOK_ALLOW_UNSIGNED === "1") {
    return { ok: true, method: "unsigned_allowed" };
  }
  return { ok: false, reason: "signature_missing" };
}

function pickField(leadData, keys) {
  if (!leadData || typeof leadData !== "object") return "";
  for (const key of keys) {
    const direct = leadData[key];
    if (direct != null && String(direct).trim()) return String(direct).trim();
  }
  // Array-of-{field_key,field_value} or {name,value} shapes
  const list = Array.isArray(leadData) ? leadData : leadData.field_data || leadData.fields;
  if (Array.isArray(list)) {
    const lowerKeys = keys.map((k) => k.toLowerCase());
    for (const item of list) {
      const name = String(item?.field_key || item?.name || item?.key || "").toLowerCase();
      const val = item?.field_value ?? item?.value ?? item?.values?.[0];
      if (lowerKeys.includes(name) && val != null && String(val).trim()) {
        return String(val).trim();
      }
    }
  }
  return "";
}

/** Map TikTok lead_data + meta → Flume fields. */
export function mapTikTokLeadToFlume(detail, notify = {}) {
  const leadData = detail?.lead_data || detail?.data?.lead_data || detail || {};
  const meta = detail?.meta_data || detail?.data?.meta_data || {};

  const name =
    pickField(leadData, ["name", "full_name", "Full name", "Name", "first_name"]) ||
    [pickField(leadData, ["first_name"]), pickField(leadData, ["last_name"])].filter(Boolean).join(" ") ||
    "TikTok lead";
  const phone = pickField(leadData, [
    "phone",
    "phone_number",
    "Phone number",
    "mobile",
    "Phone",
    "电话",
  ]);
  const email = pickField(leadData, ["email", "Email", "email_address", "邮箱"]);

  const campaign =
    notify.campaignName ||
    meta.campaign_name ||
    notify.campaignId ||
    meta.campaign_id ||
    "";

  const externalLeadId = String(notify.leadId || meta.lead_id || "");

  return {
    name,
    phone,
    email,
    source: "tiktok",
    campaign,
    externalLeadId,
    excerpt: email ? `TikTok Instant Form · ${email}` : "TikTok Instant Form lead",
    intent: "Lead form",
    raw: {
      provider: "tiktok",
      external_lead_id: externalLeadId,
      advertiser_id: notify.advertiserId || meta.advertiser_id || "",
      page_id: notify.pageId || meta.page_id || "",
      campaign_id: notify.campaignId || meta.campaign_id || "",
      ad_id: notify.adId || meta.ad_id || "",
      email: email || undefined,
      notify,
      detail,
    },
  };
}

/**
 * Fetch Instant Form / DM lead detail.
 * Primary: GET /open_api/v1.3/lead/get/ (current v1.3 equivalent of page/lead/get).
 * Fallback: GET /open_api/v1.3/page/lead/mock/get/ for test leads.
 */
export async function fetchTikTokLeadDetail({
  accessToken,
  advertiserId,
  leadId,
  pageId,
  leadSource = "INSTANT_FORM",
}) {
  if (!accessToken) throw new Error("tiktok_access_token_missing");
  if (!advertiserId) throw new Error("tiktok_advertiser_id_missing");
  if (!leadId) throw new Error("tiktok_lead_id_missing");

  const params = new URLSearchParams({
    advertiser_id: String(advertiserId),
    lead_id: String(leadId),
    lead_source: leadSource,
  });
  if (pageId) params.set("page_id", String(pageId));

  const url = `${TIKTOK_API_BASE}/open_api/v1.3/lead/get/?${params}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Access-Token": accessToken },
  });
  const body = await res.json().catch(() => ({}));
  if (res.ok && body.code === 0) {
    return body.data || body;
  }

  // Test / mock leads sometimes only resolve via mock/get
  if (pageId) {
    const mockParams = new URLSearchParams({
      advertiser_id: String(advertiserId),
      page_id: String(pageId),
      lead_source: leadSource,
    });
    const mockUrl = `${TIKTOK_API_BASE}/open_api/v1.3/page/lead/mock/get/?${mockParams}`;
    const mockRes = await fetch(mockUrl, {
      method: "GET",
      headers: { "Access-Token": accessToken },
    });
    const mockBody = await mockRes.json().catch(() => ({}));
    if (mockRes.ok && mockBody.code === 0) {
      return mockBody.data || mockBody;
    }
  }

  const msg = body.message || body.error || `TikTok lead/get failed (${res.status})`;
  const err = new Error(msg);
  err.code = body.code;
  err.requestId = body.request_id;
  throw err;
}

export function getTikTokAccessToken() {
  return process.env.TIKTOK_ACCESS_TOKEN || "";
}

export function getTikTokAdvertiserId(fallback = "") {
  return process.env.TIKTOK_ADVERTISER_ID || fallback || "";
}
