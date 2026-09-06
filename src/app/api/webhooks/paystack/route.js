import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import {
  setPlan,
  findTenantIdByEmail,
  findTenantIdByPaystackCustomerCode,
  findTenantIdByPaystackSubscriptionCode,
} from "../../../../../lib/store.js";

export const runtime = "nodejs";

function webhookSecret() {
  return (
    process.env.PAYSTACK_WEBHOOK_SECRET ||
    process.env.PAYSTACK_SECRET_KEY ||
    ""
  );
}

/** Paystack signs with HMAC SHA512 of the raw body using the secret key. */
function verifySignature(rawBody, signature, secret) {
  if (!signature || !secret) return false;
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function eventData(payload) {
  return payload?.data && typeof payload.data === "object" ? payload.data : {};
}

function customerEmail(data) {
  return data?.customer?.email || data?.email || null;
}

function customerCode(data) {
  return (
    data?.customer?.customer_code ||
    data?.customer_code ||
    (typeof data?.customer === "string" ? data.customer : null) ||
    null
  );
}

function subscriptionCode(data) {
  return (
    data?.subscription_code ||
    data?.subscription?.subscription_code ||
    null
  );
}

function planCodeFromData(data) {
  if (data?.plan?.plan_code) return data.plan.plan_code;
  if (typeof data?.plan === "string" && data.plan.startsWith("PLN_")) return data.plan;
  if (data?.plan_object?.plan_code) return data.plan_object.plan_code;
  return null;
}

/** Map webhook payload → pro_month | pro_year | null */
export function mapPlanFromEvent(data) {
  const meta = data?.metadata || {};
  if (meta.plan === "pro_year" || meta.plan === "pro_month") return meta.plan;
  // metadata may be stringified
  if (typeof meta === "string") {
    try {
      const parsed = JSON.parse(meta);
      if (parsed.plan === "pro_year" || parsed.plan === "pro_month") return parsed.plan;
    } catch {
      /* ignore */
    }
  }

  const planCode = planCodeFromData(data);
  const yearCode = process.env.PAYSTACK_PLAN_PRO_YEAR;
  const monthCode = process.env.PAYSTACK_PLAN_PRO_MONTH;
  if (planCode && yearCode && planCode === yearCode) return "pro_year";
  if (planCode && monthCode && planCode === monthCode) return "pro_month";

  const interval = data?.plan?.interval || data?.plan_object?.interval;
  if (interval === "annually" || interval === "yearly" || interval === "year") return "pro_year";
  if (interval === "monthly" || interval === "month") return "pro_month";

  return null;
}

export async function resolveTenantId(data) {
  const meta = data?.metadata || {};
  let tenantId = meta.tenant_id;
  if (!tenantId && typeof meta === "string") {
    try {
      tenantId = JSON.parse(meta).tenant_id;
    } catch {
      /* ignore */
    }
  }
  if (tenantId) return String(tenantId);

  const email = customerEmail(data);
  if (email) {
    const byEmail = await findTenantIdByEmail(email);
    if (byEmail) return byEmail;
  }

  const cust = customerCode(data);
  if (cust) {
    const byCustomer = await findTenantIdByPaystackCustomerCode(cust);
    if (byCustomer) return byCustomer;
  }

  const sub = subscriptionCode(data);
  if (sub) {
    const bySub = await findTenantIdByPaystackSubscriptionCode(sub);
    if (bySub) return bySub;
  }

  return null;
}

async function upgradeFromEvent(data) {
  const tenantId = await resolveTenantId(data);
  if (!tenantId) {
    console.warn("[paystack webhook] upgrade skipped: tenant not resolved");
    return { ok: false, reason: "tenant_not_found" };
  }
  const plan = mapPlanFromEvent(data) || "pro_month";
  const cust = customerCode(data);
  const sub = subscriptionCode(data);
  const billing = {};
  if (cust) billing.paystackCustomerCode = cust;
  if (sub) billing.paystackSubscriptionCode = sub;

  const tenant = await setPlan(plan, tenantId, billing);
  console.info("[paystack webhook] upgraded", {
    tenantId,
    plan,
    eventPlan: mapPlanFromEvent(data),
  });
  return { ok: true, tenantId, plan: tenant.plan };
}

async function downgradeFromEvent(data) {
  const tenantId = await resolveTenantId(data);
  if (!tenantId) {
    console.warn("[paystack webhook] downgrade skipped: tenant not resolved");
    return { ok: false, reason: "tenant_not_found" };
  }
  const billing = { paystackSubscriptionCode: null };
  const cust = customerCode(data);
  if (cust) billing.paystackCustomerCode = cust;
  const tenant = await setPlan("free", tenantId, billing);
  console.info("[paystack webhook] downgraded to free", { tenantId });
  return { ok: true, tenantId, plan: tenant.plan };
}

export async function POST(request) {
  const secret = webhookSecret();
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "paystack_webhook_not_configured" },
      { status: 503 }
    );
  }
  const raw = await request.text();
  const signature = request.headers.get("x-paystack-signature") || "";
  if (!verifySignature(raw, signature, secret)) {
    return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 401 });
  }

  let payload = {};
  try {
    payload = JSON.parse(raw || "{}");
  } catch {
    payload = {};
  }

  const type = payload?.event || "";
  const data = eventData(payload);
  console.info("[paystack webhook] received", type || "event");

  try {
    if (type === "charge.success" || type === "subscription.create") {
      const result = await upgradeFromEvent(data);
      return NextResponse.json({ ok: true, handled: type, ...result });
    }

    if (
      type === "subscription.disable" ||
      type === "subscription.not_renew" ||
      type === "subscription.not-renew"
    ) {
      const result = await downgradeFromEvent(data);
      return NextResponse.json({ ok: true, handled: type, ...result });
    }

    return NextResponse.json({ ok: true, ignored: type || "unknown" });
  } catch (err) {
    console.error("[paystack webhook] fulfilment error", err);
    return NextResponse.json(
      {
        ok: false,
        error: err.code || "fulfilment_error",
        message: err.message || "Fulfilment failed",
      },
      { status: 500 }
    );
  }
}
