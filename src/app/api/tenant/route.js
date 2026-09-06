import { NextResponse } from "next/server";
import { getTenant, setPlan, updateTenantSettings } from "../../../../lib/store.js";
import { requireApiSession } from "../../../../lib/api-auth.js";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiSession();
    if (auth.error) return auth.error;
    const tenant = await getTenant(auth.tenantId);
    return NextResponse.json({ tenant, user: auth.profile });
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
    const auth = await requireApiSession();
    if (auth.error) return auth.error;
    const body = await request.json().catch(() => ({}));

    if (body.plan) {
      const tenant = await setPlan(body.plan, auth.tenantId);
      return NextResponse.json({ tenant });
    }

    const tenant = await updateTenantSettings(auth.tenantId, {
      workspace: body.workspace,
      name: body.name,
      notificationEmail: body.notificationEmail ?? body.email,
    });
    return NextResponse.json({ tenant });
  } catch (err) {
    console.error("[api/tenant PATCH]", err);
    return NextResponse.json(
      { error: err.code || "tenant_update_error", message: err.message || "Failed to update tenant" },
      { status: 500 }
    );
  }
}
