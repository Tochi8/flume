import { NextResponse } from "next/server";
import { listLeads, updateLead } from "../../../lib/store";

export async function GET() {
  return NextResponse.json({ leads: listLeads() });
}

export async function PATCH(req) {
  const body = await req.json().catch(() => ({}));
  const lead = updateLead(body.id, { status: body.status, draft: body.draft });
  if (!lead) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ lead });
}
