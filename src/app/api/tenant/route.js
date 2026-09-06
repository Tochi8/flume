import { NextResponse } from "next/server";
import { getTenant, setPlan, DEMO_TENANT_ID } from "../../../../lib/store.js";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId") || DEMO_TENANT_ID;
    const tenant = await getTenant(tenantId);
    return NextResponse.json({ tenant });
  } catch (err) {
    console.error("[api/tenant]", err);
    return NextResponse.json(
      { error: err.code || "tenant_error", message: err.message || "Failed to get tenant" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const tenantId = body.tenantId || DEMO_TENANT_ID;
    if (!body.plan) {
      return NextResponse.json({ error: "plan_required" }, { status: 400 });
    }
    const tenant = await setPlan(body.plan, tenantId);
    return NextResponse.json({ tenant });
  } catch (err) {
    console.error("[api/tenant PATCH]", err);
    return NextResponse.json(
      { error: err.code || "tenant_update_error", message: err.message || "Failed to update tenant" },
      { status: 500 }
    );
  }
}
