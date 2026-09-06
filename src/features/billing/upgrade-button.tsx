"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type BillingPlan = "pro_month" | "pro_year";

type UpgradeButtonProps = {
  plan: BillingPlan;
  label: string;
  variant?: "default" | "outline";
  className?: string;
};

export function UpgradeButton({
  plan,
  label,
  variant = "default",
  className,
}: UpgradeButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function upgrade() {
    setLoading(true);
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
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        onClick={upgrade}
        disabled={loading}
        variant={variant}
        className={cn("w-full", className)}
      >
        {loading ? "Starting checkout…" : label}
      </Button>
      {error && <p className="text-sm text-danger mt-3">{error}</p>}
    </div>
  );
}
