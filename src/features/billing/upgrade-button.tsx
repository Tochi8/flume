"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type BillingPlan = "pro_month" | "pro_year";

/** Tenant plan values that may appear from the store / session. */
export type TenantPlan = "free" | "pro" | "pro_month" | "pro_year" | string;

type UpgradeButtonProps = {
  /** Target checkout plan for this card. */
  plan: BillingPlan;
  /** Tenant's current plan from the billing page. */
  currentPlan: TenantPlan;
  className?: string;
};

function normalizeCurrentPlan(plan: TenantPlan): "free" | BillingPlan {
  if (plan === "pro_year") return "pro_year";
  if (plan === "pro_month" || plan === "pro") return "pro_month";
  return "free";
}

function ctaFor(target: BillingPlan, current: "free" | BillingPlan) {
  if (current === target) {
    return {
      label: "Current plan",
      variant: "outline" as const,
      disabled: true,
    };
  }
  if (current === "free") {
    return {
      label:
        target === "pro_year"
          ? "Upgrade — ₦150,000/yr"
          : "Upgrade — ₦15,000/mo",
      variant: "default" as const,
      disabled: false,
    };
  }
  // Already on a Pro plan — offer switch to the other interval
  return {
    label: target === "pro_year" ? "Switch to yearly" : "Switch to monthly",
    variant: "default" as const,
    disabled: false,
  };
}

export function UpgradeButton({
  plan,
  currentPlan,
  className,
}: UpgradeButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const current = normalizeCurrentPlan(currentPlan);
  const { label, variant, disabled } = ctaFor(plan, current);

  async function upgrade() {
    if (disabled) return;
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
      const url = data.checkoutUrl || data.authorization_url;
      if (url) {
        window.location.href = url;
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
        disabled={disabled || loading}
        variant={variant}
        className={cn("w-full", className)}
      >
        {loading ? "Starting checkout…" : label}
      </Button>
      {error && <p className="text-sm text-danger mt-3">{error}</p>}
    </div>
  );
}
