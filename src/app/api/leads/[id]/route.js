import { NextResponse } from "next/server";
import { getLead, updateLead, listConversations, addOutboundMessage } from "../../../../../lib/store.js";
import { requireApiSession } from "../../../../../lib/api-auth.js";
import { sendWhatsAppText, getWhatsAppAccessToken } from "../../../../../lib/whatsapp.js";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  try {
    const auth = await requireApiSession();
    if (auth.error) return auth.error;
    const { id } = await params;
    const lead = await getLead(id, auth.tenantId, { mask: true });
    if (!lead) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    const messages = await listConversations(lead.id);
    return NextResponse.json({ lead, messages });
  } catch (err) {
    console.error("[api/leads/id]", err);
    return NextResponse.json(
      { error: err.code || "lead_error", message: err.message || "Failed to get lead" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const auth = await requireApiSession();
    if (auth.error) return auth.error;
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    if (body.sendMessage) {
      let waMessageId = null;
      const token = getWhatsAppAccessToken();
      if (token) {
        const leadForSend = await getLead(id, auth.tenantId, { mask: false });
        if (!leadForSend) return NextResponse.json({ error: "not_found" }, { status: 404 });
        const to = leadForSend.phoneRaw || leadForSend.phoneE164;
        try {
          const sent = await sendWhatsAppText({ to, body: body.sendMessage });
          waMessageId = sent.messageId || null;
        } catch (err) {
          console.error("[api/leads/id] WhatsApp send failed", err?.message);
          return NextResponse.json(
            { error: err.code || "whatsapp_send_failed", message: err.message || "WhatsApp send failed" },
            { status: 502 }
          );
        }
      }
      const message = await addOutboundMessage(id, body.sendMessage, auth.tenantId, { waMessageId });
      if (!message) return NextResponse.json({ error: "not_found" }, { status: 404 });
      const lead = await getLead(id, auth.tenantId);
      return NextResponse.json({ lead, message, waSent: Boolean(waMessageId) });
    }

    const lead = await updateLead(id, body, auth.tenantId);
    if (!lead) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ lead });
  } catch (err) {
    console.error("[api/leads/id PATCH]", err);
    return NextResponse.json(
      { error: err.code || "lead_update_error", message: err.message || "Failed to update lead" },
      { status: 500 }
    );
  }
}
