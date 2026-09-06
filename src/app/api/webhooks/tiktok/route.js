import { NextResponse, after } from "next/server";
import {
  parseTikTokLeadNotify,
  verifyTikTokWebhookSignature,
  fetchTikTokLeadDetail,
  mapTikTokLeadToFlume,
  getTikTokAccessToken,
  getTikTokAdvertiserId,
} from "../../../../../lib/tiktok.js";
import { ingestLead, DEMO_TENANT_ID } from "../../../../../lib/store.js";

export const runtime = "nodejs";

function webhookTenantId() {
  return process.env.TIKTOK_TENANT_ID || process.env.FLUME_DEMO_TENANT_ID || DEMO_TENANT_ID;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "tiktok-webhook",
    hint: "POST Instant Form / Subscription lead notifies here. Configure callback https://flume-ten.vercel.app/api/webhooks/tiktok",
  });
}

/**
 * TikTok Instant Form / Marketing API lead subscription webhook.
 * Always ACK with 200 after accepting a verified payload (TikTok retries otherwise).
 * Notify typically includes lead_id + advertiser_id + page_id; we then GET /v1.3/lead/get/.
 */
export async function POST(request) {
  const secret = process.env.TIKTOK_CLIENT_SECRET || "";
  const rawBody = await request.text().catch(() => "");

  if (!secret) {
    return NextResponse.json({ ok: true, skipped: "tiktok_secret_missing" });
  }

  const verified = verifyTikTokWebhookSignature(rawBody, request.headers, secret);
  if (!verified.ok) {
    // Reject forgeries so TikTok can alert; do not process.
    return NextResponse.json(
      { ok: false, error: "unauthorized", reason: verified.reason },
      { status: 401 }
    );
  }

  let payload = {};
  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    // Still ACK — malformed body should not trigger infinite retries for valid HMAC edge cases
    return NextResponse.json({ ok: true, skipped: "invalid_json" });
  }

  const notify = parseTikTokLeadNotify(payload);
  if (!notify?.leadId) {
    // Health / non-lead events: ACK
    return NextResponse.json({ ok: true, skipped: "not_a_lead_notify" });
  }

  // Accept quickly; finish Marketing API fetch + ingest after the response.
  after(async () => {
    try {
      await processTikTokLead(notify);
    } catch (err) {
      console.error("[webhooks/tiktok] process failed", {
        leadId: notify.leadId,
        message: err?.message,
        code: err?.code,
      });
    }
  });

  return NextResponse.json({
    ok: true,
    accepted: true,
    lead_id: notify.leadId,
    verify: verified.method,
  });
}

async function processTikTokLead(notify) {
  const accessToken = getTikTokAccessToken();
  const advertiserId = getTikTokAdvertiserId(notify.advertiserId);
  if (!accessToken) {
    console.warn("[webhooks/tiktok] TIKTOK_ACCESS_TOKEN missing — cannot fetch lead detail");
    return;
  }
  if (!advertiserId) {
    console.warn("[webhooks/tiktok] advertiser_id missing in payload and TIKTOK_ADVERTISER_ID");
    return;
  }

  const detail = await fetchTikTokLeadDetail({
    accessToken,
    advertiserId,
    leadId: notify.leadId,
    pageId: notify.pageId || undefined,
  });

  const mapped = mapTikTokLeadToFlume(detail, { ...notify, advertiserId });
  if (!mapped.phone) {
    console.warn("[webhooks/tiktok] lead has no phone — skipping ingest", notify.leadId);
    return;
  }

  const result = await ingestLead(webhookTenantId(), mapped);
  console.info("[webhooks/tiktok] ingest", {
    leadId: notify.leadId,
    created: result.created,
    deduped: result.deduped,
    flumeId: result.lead?.id,
  });
  return result;
}
