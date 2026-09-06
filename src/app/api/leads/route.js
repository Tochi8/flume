import { NextResponse } from "next/server";
import { listLeads, DEMO_TENANT_ID } from "../../../../lib/store.js";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId") || DEMO_TENANT_ID;
    const mask = searchParams.get("mask") !== "0";
    const leads = await listLeads(tenantId, { mask });
    return NextResponse.json({ leads, tenantId });
  } catch (err) {
    console.error("[api/leads]", err);
    return NextResponse.json(
      { error: err.code || "leads_error", message: err.message || "Failed to list leads" },
      { status: 500 }
    );
  }
}
