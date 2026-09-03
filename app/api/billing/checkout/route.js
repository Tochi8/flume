import { NextResponse } from "next/server";
import { createCheckout } from "../../../../lib/bachs";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const plan = body.plan === "year" ? "year" : "month";
  const productId =
    plan === "year"
      ? process.env.BACHS_PRODUCT_PRO_YEAR
      : process.env.BACHS_PRODUCT_PRO_MONTH;

  if (!process.env.BACHS_API_KEY || !productId) {
    return NextResponse.json(
      {
        error: "missing_bachs_config",
        hint: "Add BACHS_API_KEY and product ids, then create recurring products in the Bachs dashboard.",
      },
      { status: 501 }
    );
  }

  try {
    const session = await createCheckout({
      productId,
      plan,
      email: body.email || "owner@example.com",
      name: body.name || "Flume workspace",
    });
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: error.message, detail: error.body || null },
      { status: error.status || 500 }
    );
  }
}
