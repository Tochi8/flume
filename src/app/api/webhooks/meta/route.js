import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Meta webhook verification (hub.challenge). Safe no-op when secret missing. */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  const verify = process.env.META_VERIFY_TOKEN || "flume-verify";
  if (mode === "subscribe" && token === verify && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "forbidden" }, { status: 403 });
}

export async function POST(request) {
  const secret = process.env.META_APP_SECRET;
  // Always consume body so Meta does not retry forever; skip processing without secret.
  await request.text().catch(() => "");
  if (!secret) {
    return NextResponse.json({ ok: true, skipped: "meta_secret_missing" });
  }
  // Phase 1 stub — signature check + ingest come later.
  return NextResponse.json({ ok: true });
}
