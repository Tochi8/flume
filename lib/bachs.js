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
    const err = new Error(data.detail || data.error_code || "bachs_error");
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export async function createCheckout({ productId, email, name, plan }) {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  return bachsFetch("/v1/checkout-sessions", {
    method: "POST",
    body: JSON.stringify({
      product_cart: [{ product_id: productId, quantity: 1 }],
      billing_currency: "NGN",
      return_url: `${appUrl}/app/billing?status=ok`,
      cancel_url: `${appUrl}/app/billing?status=cancel`,
      customer: { email, name },
      metadata: { product: "flume", plan },
    }),
  });
}
