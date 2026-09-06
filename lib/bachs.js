const BASE = process.env.BACHS_API_BASE || "https://sandbox-api.bachs.io";

export async function bachsFetch(path, init = {}) {
  const key = process.env.BACHS_API_KEY;
  if (!key) {
    const err = new Error("missing_bachs_key");
    err.code = "missing_bachs_key";
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
  if (!res.ok) {
    const code = data.error_code;
    const detail = data.detail || code || "bachs_error";
    let message = detail;
    if (res.status === 404 || code === "NOT_FOUND") {
      message =
        "Bachs product not found. Check sandbox product IDs (BACHS_PRODUCT_PRO_MONTH / YEAR).";
    }
    const err = new Error(message);
    err.status = res.status;
    err.body = data;
    err.code = code;
    throw err;
  }
  return data;
}

export async function createCheckout({ productId, email, name, plan, tenantId }) {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const metadata = { product: "flume", plan };
  if (tenantId) metadata.tenant_id = String(tenantId);
  const customerName = (name && String(name).trim()) || "Flume user";
  return bachsFetch("/v1/checkout-sessions", {
    method: "POST",
    body: JSON.stringify({
      product_cart: [{ product_id: productId, quantity: 1 }],
      billing_currency: "NGN",
      success_url: `${appUrl}/billing?status=ok`,
      cancel_url: `${appUrl}/billing?status=cancel`,
      customer: { email, name: customerName },
      metadata,
    }),
  });
}
