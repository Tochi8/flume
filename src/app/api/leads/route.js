import { NextResponse } from "next/server";
import { listLeads } from "../../../../lib/store.js";
import { requireApiSession } from "../../../../lib/api-auth.js";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const auth = await requireApiSession();
    if (auth.error) return auth.error;
    const { searchParams } = new URL(request.url);
    const mask = searchParams.get("mask") !== "0";
    const leads = await listLeads(auth.tenantId, { mask });
    return NextResponse.json({ leads, tenantId: auth.tenantId });
  } catch (err) {
    console.error("[api/leads]", err);
    return NextResponse.json(
      { error: err.code || "leads_error", message: err.message || "Failed to list leads" },
      { status: 500 }
    );
  }
}
