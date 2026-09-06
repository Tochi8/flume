import { NextResponse } from "next/server";
import { listCampaigns } from "../../../../lib/store.js";
import { requireApiSession } from "../../../../lib/api-auth.js";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiSession();
    if (auth.error) return auth.error;
    const campaigns = await listCampaigns(auth.tenantId);
    return NextResponse.json({ campaigns });
  } catch (err) {
    console.error("[api/campaigns]", err);
    return NextResponse.json({ error: err.message || "campaigns_error" }, { status: 500 });
  }
}
