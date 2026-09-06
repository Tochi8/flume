import { NextResponse } from "next/server";
import { getQualificationConfig, saveQualificationConfig } from "../../../../lib/store.js";
import { requireApiSession } from "../../../../lib/api-auth.js";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiSession();
    if (auth.error) return auth.error;
    const config = await getQualificationConfig(auth.tenantId);
    return NextResponse.json({ config });
  } catch (err) {
    console.error("[api/qualification]", err);
    return NextResponse.json({ error: err.message || "qualification_error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const auth = await requireApiSession();
    if (auth.error) return auth.error;
    const body = await request.json().catch(() => ({}));
    const config = await saveQualificationConfig(auth.tenantId, body);
    return NextResponse.json({ config });
  } catch (err) {
    console.error("[api/qualification PUT]", err);
    return NextResponse.json(
      {
        error: err.message || "qualification_save_error",
        hint: "Apply supabase/migrations/20260906_auth_desk.sql if tables are missing.",
      },
      { status: 500 }
    );
  }
}
