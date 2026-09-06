import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import {
  setPlan,
  findTenantIdByEmail,
  findTenantIdByBachsCustomerId,
  findTenantIdByBachsSubscriptionId,
} from "../../../../../lib/store.js";

export const runtime = "nodejs";

function verifySignature(rawBody, signature, secret) {
  if (!signature || !secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature).replace(/^sha256=/, ""));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function eventType(payload) {
  return payload?.type || payload?.event || "";
}

function eventData(payload) {
  return payload?.data && typeof payload.data === "object" ? payload.data : payload || {};
}

function customerEmail(data) {
  return data?.customer?.email || data?.email || null;
}

function customerId(data) {
  return (
    data?.customer?.customer_id ||
    data?.customer?.id ||
    data?.customer_id ||
    null
  );
}

function subscriptionId(data) {
  return data?.subscription_id || data?.id || null;
}

function productIdFromData(data) {
  if (data?.product_id) return data.product_id;
  const cart = data?.product_cart;
  if (Array.isArray(cart) && cart[0]?.product_id) return cart[0].product_id;
  return null;
}

/** Map webhook payload → pro_month | pro_year | null */
export function mapPlanFromEvent(data) {
  const meta = data?.metadata || {};
  if (meta.plan === "pro_year" || meta.plan === "pro_month") return meta.plan;

  const productId = productIdFromData(data);
  const yearId = process.env.BACHS_PRODUCT_PRO_YEAR;
  const monthId = process.env.BACHS_PRODUCT_PRO_MONTH;
  if (productId && yearId && productId === yearId) return "pro_year";
  if (productId && monthId && productId === monthId) return "pro_month";

  const interval = data?.billing_cycle?.interval;
  if (interval === "year" || interval === "annual" || interval === "yr") return "pro_year";
  if (interval === "month" || interval === "mo") return "pro_month";

  return null;
}

export async function resolveTenantId(data) {
  const meta = data?.metadata || {};
  if (meta.tenant_id) return String(meta.tenant_id);

  const email = customerEmail(data);
  if (email) {
    const byEmail = await findTenantIdByEmail(email);
    if (byEmail) return byEmail;
  }

  const custId = customerId(data);
  if (custId) {
    const byCustomer = await findTenantIdByBachsCustomerId(custId);
    if (byCustomer) return byCustomer;
  }

  const subId = subscriptionId(data);
  if (subId && String(subId).startsWith("sub_")) {
    const bySub = await findTenantIdByBachsSubscriptionId(subId);
    if (bySub) return bySub;
  }

  return null;
}

async function upgradeFromEvent(data) {
  const tenantId = await resolveTenantId(data);
  if (!tenantId) {
    console.warn("[bachs webhook] upgrade skipped: tenant not resolved");
    return { ok: false, reason: "tenant_not_found" };
  }
  const plan = mapPlanFromEvent(data) || "pro_month";
  const custId = customerId(data);
  const subId = subscriptionId(data);
  const billing = {};
  if (custId) billing.bachsCustomerId = custId;
  if (subId && String(subId).startsWith("sub_")) billing.bachsSubscriptionId = subId;

  const tenant = await setPlan(plan, tenantId, billing);
  console.info("[bachs webhook] upgraded", { tenantId, plan, eventPlan: mapPlanFromEvent(data) });
  return { ok: true, tenantId, plan: tenant.plan };
}

async function downgradeFromEvent(data) {
  const tenantId = await resolveTenantId(data);
  if (!tenantId) {
    console.warn("[bachs webhook] downgrade skipped: tenant not resolved");
    return { ok: false, reason: "tenant_not_found" };
  }
  const billing = { bachsSubscriptionId: null };
  const custId = customerId(data);
  if (custId) billing.bachsCustomerId = custId;
  const tenant = await setPlan("free", tenantId, billing);
  console.info("[bachs webhook] downgraded to free", { tenantId });
  return { ok: true, tenantId, plan: tenant.plan };
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

  let payload = {};
  try {
    payload = JSON.parse(raw || "{}");
  } catch {
    payload = {};
  }

  const type = eventType(payload);
  const data = eventData(payload);
  console.info("[bachs webhook] received", type || "event");

  try {
    if (
      type === "collection.succeeded" ||
      type === "customer.subscription.created" ||
      type === "customer.subscription.updated" ||
      type === "checkout.completed"
    ) {
      // Only upgrade on active/succeeded subscription updates; ignore canceled updates.
      if (type === "customer.subscription.updated" && data?.status === "canceled") {
        const result = await downgradeFromEvent(data);
        return NextResponse.json({ ok: true, handled: type, ...result });
      }
      const result = await upgradeFromEvent(data);
      return NextResponse.json({ ok: true, handled: type, ...result });
    }

    if (type === "customer.subscription.deleted") {
      const result = await downgradeFromEvent(data);
      return NextResponse.json({ ok: true, handled: type, ...result });
    }

    return NextResponse.json({ ok: true, ignored: type || "unknown" });
  } catch (err) {
    console.error("[bachs webhook] fulfilment error", err);
    return NextResponse.json(
      { ok: false, error: err.code || "fulfilment_error", message: err.message || "Fulfilment failed" },
      { status: 500 }
    );
  }
}
