import { NextResponse, after } from "next/server";
import {
  parseWhatsAppMessages,
  parseWhatsAppStatuses,
  getWhatsAppVerifyToken,
} from "../../../../../lib/whatsapp.js";
import {
  ingestLead,
  addInboundMessage,
  updateMessageStatusByWaId,
  normalizePhoneE164,
  DEMO_TENANT_ID,
} from "../../../../../lib/store.js";

export const runtime = "nodejs";

function webhookTenantId() {
  return process.env.WHATSAPP_TENANT_ID || process.env.FLUME_DEMO_TENANT_ID || DEMO_TENANT_ID;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  const verify = getWhatsAppVerifyToken();
  if (mode === "subscribe" && token === verify && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "forbidden" }, { status: 403 });
}

/**
 * WhatsApp Cloud API webhook.
 * ACK 200 fast; process inbound messages + statuses in after() (same pattern as TikTok).
 */
export async function POST(request) {
  const rawBody = await request.text().catch(() => "");
  let payload = {};
  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    return NextResponse.json({ ok: true, skipped: "invalid_json" });
  }

  const messages = parseWhatsAppMessages(payload);
  const statuses = parseWhatsAppStatuses(payload);

  if (!messages.length && !statuses.length) {
    return NextResponse.json({ ok: true, skipped: "no_messages_or_statuses" });
  }

  after(async () => {
    try {
      await processWhatsAppWebhook({ messages, statuses });
    } catch (err) {
      console.error("[webhooks/whatsapp] process failed", {
        message: err?.message,
        code: err?.code,
      });
    }
  });

  return NextResponse.json({
    ok: true,
    accepted: true,
    messages: messages.length,
    statuses: statuses.length,
  });
}

async function processWhatsAppWebhook({ messages, statuses }) {
  const tenantId = webhookTenantId();

  for (const st of statuses) {
    try {
      await updateMessageStatusByWaId(st.waMessageId, st.status);
    } catch (err) {
      console.error("[webhooks/whatsapp] status update failed", {
        waMessageId: st.waMessageId,
        message: err?.message,
      });
    }
  }

  for (const msg of messages) {
    try {
      await processInboundMessage(tenantId, msg);
    } catch (err) {
      console.error("[webhooks/whatsapp] inbound failed", {
        waMessageId: msg.waMessageId,
        message: err?.message,
        code: err?.code,
      });
    }
  }
}

async function processInboundMessage(tenantId, msg) {
  const phone = normalizePhoneE164(msg.from);
  if (!phone) {
    console.warn("[webhooks/whatsapp] skip — no phone", msg.waMessageId);
    return;
  }

  const name = msg.profileName || "WhatsApp lead";
  const excerpt = msg.body || "[message]";

  const result = await ingestLead(tenantId, {
    name,
    phone,
    source: "whatsapp",
    campaign: "",
    excerpt,
    intent: "WhatsApp inbound",
    externalLeadId: `wa_${phone}`,
    raw: {
      provider: "whatsapp",
      wa_message_id: msg.waMessageId,
      wa_from: msg.from,
      phone_number_id: msg.phoneNumberId,
      type: msg.type,
    },
  });

  const leadId = result.lead?.id;
  if (!leadId) return;

  await addInboundMessage(leadId, excerpt, {
    waMessageId: msg.waMessageId,
    tenantId,
  });

  console.info("[webhooks/whatsapp] ingest", {
    waMessageId: msg.waMessageId,
    created: result.created,
    deduped: result.deduped,
    flumeId: leadId,
  });
}
