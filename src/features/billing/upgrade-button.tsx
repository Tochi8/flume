"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Plan = "pro_month" | "pro_year";

export function UpgradeButton() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<Plan | null>(null);

  async function upgrade(plan: Plan) {
    setLoading(plan);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || data.error || "Checkout unavailable");
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(null);
    }
  }

  const busy = loading !== null;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => upgrade("pro_month")} disabled={busy}>
          {loading === "pro_month" ? "Starting checkout…" : "Upgrade — ₦15,000/month"}
        </Button>
        <Button onClick={() => upgrade("pro_year")} disabled={busy} variant="outline">
          {loading === "pro_year" ? "Starting checkout…" : "Upgrade — ₦150,000/year"}
        </Button>
      </div>
      {error && <p className="text-sm text-danger mt-3">{error}</p>}
    </div>
  );
}
