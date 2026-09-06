import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

export const runtime = "nodejs";

function verifySignature(rawBody, signature, secret) {
  if (!signature || !secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature).replace(/^sha256=/, ""));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request) {
  const secret = process.env.BACHS_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "bachs_webhook_not_configured" },
      { status: 503 }
    );
  }
  const raw = await request.text();
  const signature =
    request.headers.get("x-bachs-signature") ||
    request.headers.get("x-signature") ||
    "";
  if (!verifySignature(raw, signature, secret)) {
    return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 401 });
  }
  // Phase 1: acknowledge only. Plan upgrades wire later.
  let payload = {};
  try {
    payload = JSON.parse(raw || "{}");
  } catch {
    payload = {};
  }
  console.info("[bachs webhook] received", payload?.type || payload?.event || "event");
  return NextResponse.json({ ok: true });
}
