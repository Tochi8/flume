import { NextResponse } from "next/server";
import { listConnections, setConnectionStatus } from "../../../../lib/store.js";
import { requireApiSession } from "../../../../lib/api-auth.js";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiSession();
    if (auth.error) return auth.error;
    const connections = await listConnections(auth.tenantId);
    return NextResponse.json({ connections });
  } catch (err) {
    console.error("[api/connections]", err);
    return NextResponse.json({ error: err.message || "connections_error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const auth = await requireApiSession();
    if (auth.error) return auth.error;
    const body = await request.json().catch(() => ({}));
    if (!body.kind) {
      return NextResponse.json({ error: "kind_required" }, { status: 400 });
    }
    const connections = await setConnectionStatus(auth.tenantId, body.kind, {
      connected: body.connected !== false && body.state !== "not_connected",
      externalId: body.externalId ?? body.meta,
    });
    return NextResponse.json({ connections });
  } catch (err) {
    console.error("[api/connections PATCH]", err);
    return NextResponse.json({ error: err.message || "connections_update_error" }, { status: 500 });
  }
}
