import { NextResponse } from "next/server";
import { hasSupabaseAdmin, supabaseAdmin } from "../../../../lib/supabase";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const email = String(body?.email || "").trim().toLowerCase();
  const problem = String(body?.problem || "").trim();

  if (!EMAIL.test(email)) {
    return NextResponse.json({ ok: false, error: "email_required" }, { status: 400 });
  }
  if (problem.length < 8) {
    return NextResponse.json({ ok: false, error: "problem_required" }, { status: 400 });
  }
  if (problem.length > 2000) {
    return NextResponse.json({ ok: false, error: "problem_too_long" }, { status: 400 });
  }

  if (!hasSupabaseAdmin()) {
    return NextResponse.json({
      ok: true,
      stored: false,
      note: "Waitlist saved on this request only. Add the waitlist table and service role key to keep signups.",
    });
  }

  const db = supabaseAdmin();
  const { error } = await db.from("waitlist").upsert(
    { email, problem },
    { onConflict: "email" }
  );

  if (error) {
    console.error("waitlist insert", error.message);
    return NextResponse.json({
      ok: true,
      stored: false,
      note: "Could not write to the waitlist table. Run supabase/migrations/20260907_waitlist.sql.",
    });
  }

  return NextResponse.json({ ok: true, stored: true });
}
