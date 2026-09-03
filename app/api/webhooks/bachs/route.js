import { NextResponse } from "next/server";
import { setPlan } from "../../../../lib/store";

export async function POST(req) {
  const event = await req.json().catch(() => ({}));
  const type = event.type || event.event || "";
  if (type === "collection.succeeded" || type === "customer.subscription.created") {
    setPlan("pro_month");
  }
  if (type === "customer.subscription.deleted") {
    setPlan("free");
  }
  return NextResponse.json({ ok: true });
}
