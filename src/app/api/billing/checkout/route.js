import { NextResponse } from "next/server";
import {
  initializeTransaction,
  planCodeFor,
  amountFor,
} from "../../../../../lib/paystack.js";
import { getTenant } from "../../../../../lib/store.js";
import { requireApiSession } from "../../../../../lib/api-auth.js";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const auth = await requireApiSession();
    if (auth.error) return auth.error;
    const body = await request.json().catch(() => ({}));
    const plan = body.plan === "pro_year" ? "pro_year" : "pro_month";
    const planCode = planCodeFor(plan);

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        {
          error: "billing_not_configured",
          message:
            "Paystack is not configured. Set PAYSTACK_SECRET_KEY (and plan codes PAYSTACK_PLAN_PRO_MONTH / PAYSTACK_PLAN_PRO_YEAR) in env.",
        },
        { status: 503 }
      );
    }

    if (!planCode) {
      return NextResponse.json(
        {
          error: "billing_plan_not_configured",
          message:
            plan === "pro_year"
              ? "Missing PAYSTACK_PLAN_PRO_YEAR plan_code (PLN_…)."
              : "Missing PAYSTACK_PLAN_PRO_MONTH plan_code (PLN_…).",
        },
        { status: 503 }
      );
    }

    const tenant = await getTenant(auth.tenantId);
    const email = tenant.notificationEmail || auth.profile?.email;
    if (!email) {
      return NextResponse.json(
        { error: "missing_email", message: "A billing email is required for checkout." },
        { status: 400 }
      );
    }

    const session = await initializeTransaction({
      email,
      planCode,
      plan,
      tenantId: auth.tenantId,
      // Optional when plan is set; Paystack uses plan amount. Kept as fallback context.
      amount: amountFor(plan),
      callbackUrl: `${process.env.APP_URL || "http://localhost:3000"}/billing?status=ok`,
    });

    const authorizationUrl =
      session.authorization_url || session.authorizationUrl || session.checkout_url;

    return NextResponse.json({
      checkoutUrl: authorizationUrl,
      authorization_url: authorizationUrl,
      reference: session.reference,
      access_code: session.access_code,
      session,
    });
  } catch (err) {
    console.error("[api/billing/checkout]", err);
    return NextResponse.json(
      { error: err.code || "checkout_error", message: err.message || "Checkout failed" },
      { status: err.status || 500 }
    );
  }
}
