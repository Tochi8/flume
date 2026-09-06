import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  const verify = process.env.WHATSAPP_VERIFY_TOKEN || "flume-wa-verify";
  if (mode === "subscribe" && token === verify && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "forbidden" }, { status: 403 });
}

export async function POST(request) {
  await request.text().catch(() => "");
  // Safe stub: accept delivery; Cloud API processing comes later.
  return NextResponse.json({ ok: true });
}
