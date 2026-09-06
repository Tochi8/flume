import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, service: "tiktok-webhook" });
}

export async function POST(request) {
  const secret = process.env.TIKTOK_CLIENT_SECRET;
  await request.text().catch(() => "");
  if (!secret) {
    return NextResponse.json({ ok: true, skipped: "tiktok_secret_missing" });
  }
  return NextResponse.json({ ok: true });
}
