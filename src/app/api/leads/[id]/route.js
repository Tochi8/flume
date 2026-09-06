import { NextResponse } from "next/server";
import { getLead, updateLead, listConversations, DEMO_TENANT_ID } from "../../../../../lib/store.js";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId") || DEMO_TENANT_ID;
    const mask = searchParams.get("mask") !== "0";
    const lead = await getLead(id, tenantId, { mask });
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
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const tenantId = body.tenantId || DEMO_TENANT_ID;
    const lead = await updateLead(id, body, tenantId);
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
