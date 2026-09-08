/**
 * WhatsApp Cloud API (official Graph only — no Baileys).
 * Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
 */

export const GRAPH_API_VERSION = "v21.0";
export const GRAPH_API_BASE =
  process.env.WHATSAPP_GRAPH_API_BASE || `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export function getWhatsAppAccessToken() {
  return process.env.WHATSAPP_ACCESS_TOKEN || "";
}

export function getWhatsAppPhoneNumberId() {
  return process.env.WHATSAPP_PHONE_NUMBER_ID || "";
}

export function getWhatsAppBusinessAccountId() {
  return process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || "";
}

export function getWhatsAppVerifyToken() {
  return process.env.WHATSAPP_VERIFY_TOKEN || "flume-wa-verify";
}

/**
 * Extract inbound text messages from a Cloud API webhook payload.
 * Shape: entry[].changes[].value.messages[] (+ contacts for profile name).
 */
export function parseWhatsAppMessages(payload) {
  if (!payload || typeof payload !== "object") return [];
  const out = [];
  const entries = Array.isArray(payload.entry) ? payload.entry : [];
  for (const entry of entries) {
    const changes = Array.isArray(entry?.changes) ? entry.changes : [];
    for (const change of changes) {
      const value = change?.value;
      if (!value || typeof value !== "object") continue;
      const messages = Array.isArray(value.messages) ? value.messages : [];
      if (!messages.length) continue;
      const contacts = Array.isArray(value.contacts) ? value.contacts : [];
      const contactByWaId = new Map(
        contacts.map((c) => [String(c?.wa_id || ""), c]).filter(([k]) => k)
      );
      const metadata = value.metadata || {};
      for (const msg of messages) {
        if (!msg?.id || !msg?.from) continue;
        const contact = contactByWaId.get(String(msg.from)) || contacts[0] || {};
        const profileName = contact?.profile?.name || "";
        let body = "";
        const type = msg.type || "unknown";
        if (type === "text") body = msg.text?.body || "";
        else if (type === "button") body = msg.button?.text || msg.button?.payload || "";
        else if (type === "interactive") {
          body =
            msg.interactive?.button_reply?.title ||
            msg.interactive?.list_reply?.title ||
            "";
        } else if (type === "image" || type === "audio" || type === "video" || type === "document") {
          body = msg[type]?.caption || `[${type}]`;
        } else {
          body = `[${type}]`;
        }
        out.push({
          waMessageId: String(msg.id),
          from: String(msg.from),
          profileName: String(profileName || ""),
          body: String(body || "").trim(),
          type,
          timestamp: msg.timestamp ? String(msg.timestamp) : null,
          phoneNumberId: metadata.phone_number_id
            ? String(metadata.phone_number_id)
            : "",
          displayPhone: metadata.display_phone_number
            ? String(metadata.display_phone_number)
            : "",
          raw: msg,
        });
      }
    }
  }
  return out;
}

/**
 * Extract delivery/read status updates from entry[].changes[].value.statuses[].
 */
export function parseWhatsAppStatuses(payload) {
  if (!payload || typeof payload !== "object") return [];
  const out = [];
  const entries = Array.isArray(payload.entry) ? payload.entry : [];
  for (const entry of entries) {
    const changes = Array.isArray(entry?.changes) ? entry.changes : [];
    for (const change of changes) {
      const value = change?.value;
      const statuses = Array.isArray(value?.statuses) ? value.statuses : [];
      for (const st of statuses) {
        if (!st?.id) continue;
        out.push({
          waMessageId: String(st.id),
          status: String(st.status || ""),
          timestamp: st.timestamp ? String(st.timestamp) : null,
          recipientId: st.recipient_id ? String(st.recipient_id) : "",
          errors: Array.isArray(st.errors) ? st.errors : [],
          raw: st,
        });
      }
    }
  }
  return out;
}

/**
 * Send a text message via Graph Cloud API.
 * POST /{PHONE_NUMBER_ID}/messages
 * @returns {{ messageId: string, raw: object }}
 */
export async function sendWhatsAppText({ to, body, accessToken, phoneNumberId } = {}) {
  const token = accessToken || getWhatsAppAccessToken();
  const phoneId = phoneNumberId || getWhatsAppPhoneNumberId();
  if (!token) throw Object.assign(new Error("whatsapp_access_token_missing"), { code: "whatsapp_token_missing" });
  if (!phoneId) throw Object.assign(new Error("whatsapp_phone_number_id_missing"), { code: "whatsapp_phone_id_missing" });
  if (!to) throw Object.assign(new Error("whatsapp_to_missing"), { code: "whatsapp_to_missing" });
  if (!body) throw Object.assign(new Error("whatsapp_body_missing"), { code: "whatsapp_body_missing" });

  // Graph expects digits without leading +
  const toDigits = String(to).replace(/\D/g, "");
  const url = `${GRAPH_API_BASE}/${phoneId}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: toDigits,
      type: "text",
      text: { preview_url: false, body: String(body) },
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    const msg = json.error?.message || `WhatsApp send failed (${res.status})`;
    const err = new Error(msg);
    err.code = json.error?.code || "whatsapp_send_failed";
    err.raw = json;
    throw err;
  }
  const messageId = json.messages?.[0]?.id || "";
  return { messageId: String(messageId), raw: json };
}
