import { NextResponse } from "next/server";
import { createCheckout } from "../../../../../lib/bachs.js";
import { getTenant } from "../../../../../lib/store.js";
import { requireApiSession } from "../../../../../lib/api-auth.js";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const auth = await requireApiSession();
    if (auth.error) return auth.error;
    const body = await request.json().catch(() => ({}));
    const plan = body.plan === "pro_year" ? "pro_year" : "pro_month";
    const productId =
      plan === "pro_year"
        ? process.env.BACHS_PRODUCT_PRO_YEAR
        : process.env.BACHS_PRODUCT_PRO_MONTH;

    if (!process.env.BACHS_API_KEY || !productId) {
      return NextResponse.json(
        {
          error: "billing_not_configured",
          message:
            "Bachs keys or product IDs are missing. Set BACHS_API_KEY and BACHS_PRODUCT_PRO_MONTH in env.",
        },
        { status: 503 }
      );
    }

    const tenant = await getTenant(auth.tenantId);
    const session = await createCheckout({
      productId,
      email: tenant.notificationEmail || auth.profile.email,
      name: tenant.workspace || tenant.name,
      plan,
      tenantId: auth.tenantId,
    });

    return NextResponse.json({
      checkoutUrl: session.checkout_url || session.url || session.link,
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
