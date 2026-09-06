import { NextResponse } from "next/server";
import { getLead, updateLead, listConversations, addOutboundMessage } from "../../../../../lib/store.js";
import { requireApiSession } from "../../../../../lib/api-auth.js";

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
      const message = await addOutboundMessage(id, body.sendMessage, auth.tenantId);
      if (!message) return NextResponse.json({ error: "not_found" }, { status: 404 });
      const lead = await getLead(id, auth.tenantId);
      return NextResponse.json({ lead, message });
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
