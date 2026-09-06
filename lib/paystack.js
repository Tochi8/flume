const BASE = process.env.PAYSTACK_API_BASE || "https://api.paystack.co";

/** Amounts in kobo (NGN subunits) — used when no plan code is set. */
export const AMOUNT_PRO_MONTH_KOBO = 1_500_000; // ₦15,000
export const AMOUNT_PRO_YEAR_KOBO = 15_000_000; // ₦150,000

export async function paystackFetch(path, init = {}) {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    const err = new Error("missing_paystack_key");
    err.code = "missing_paystack_key";
    throw err;
  }
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.status === false) {
    const message = data.message || data.error || "paystack_error";
    const err = new Error(message);
    err.status = res.status;
    err.body = data;
    err.code = data.code || "paystack_error";
    throw err;
  }
  return data;
}

/**
 * Initialize a Paystack transaction (subscription when `plan` plan_code is set).
 * Amount is optional when plan is set — Paystack uses the plan amount.
 * @see https://paystack.com/docs/payments/subscriptions/
 */
export async function initializeTransaction({
  email,
  planCode,
  plan,
  tenantId,
  amount,
  callbackUrl,
}) {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const metadata = {
    product: "flume",
    plan: plan || undefined,
    tenant_id: tenantId ? String(tenantId) : undefined,
  };

  const body = {
    email,
    callback_url: callbackUrl || `${appUrl}/billing?status=ok`,
    currency: "NGN",
    metadata,
  };

  if (planCode) {
    body.plan = planCode;
  }
  // Amount optional when plan is set (Paystack uses plan amount); still send when known.
  if (amount != null) {
    body.amount = amount;
  }

  const result = await paystackFetch("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return result.data || result;
}

export function planCodeFor(plan) {
  if (plan === "pro_year") return process.env.PAYSTACK_PLAN_PRO_YEAR || "";
  return process.env.PAYSTACK_PLAN_PRO_MONTH || "";
}

export function amountFor(plan) {
  return plan === "pro_year" ? AMOUNT_PRO_YEAR_KOBO : AMOUNT_PRO_MONTH_KOBO;
}
