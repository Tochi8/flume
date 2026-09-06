import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { UpgradeButton } from "@/features/billing/upgrade-button";
import { requireSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const PRO_FEATURES = [
  "1,000 leads/mo",
  "Priority support",
  "Campaign reporting",
] as const;

function FeatureList() {
  return (
    <ul className="mt-6 space-y-3">
      {PRO_FEATURES.map((feature) => (
        <li key={feature} className="flex items-start gap-2.5 text-sm text-ink">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-light text-green-dark">
            <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
          </span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function BillingPage() {
  const { tenant } = await requireSession();
  const used = tenant.extractsUsed ?? 0;
  const limit = tenant.extractLimit ?? 50;
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const planLabel =
    tenant.plan === "pro_month" || tenant.plan === "pro_year" || tenant.plan === "pro"
      ? "Pro"
      : "Free";

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-10 py-6 md:py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-[28px] text-ink">Billing</h1>
        <p className="text-sub mt-1">You&apos;re on the {planLabel} plan.</p>
      </div>

      <Card className="p-5 md:p-6 mb-6">
        <CardTitle className="mb-4">Current usage</CardTitle>
        <div className="text-sm text-sub mb-1.5">
          {used} / {limit} leads used this month
        </div>
        <div className="w-full h-1.5 rounded-pill bg-border overflow-hidden">
          <div className="h-full bg-green" style={{ width: `${pct}%` }} />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <Card className="flex flex-col p-5 md:p-6">
          <h3 className="font-display font-semibold text-ink text-lg">Pro Monthly</h3>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-display font-bold text-3xl md:text-4xl text-ink tracking-tight">
              $10
            </span>
            <span className="text-sub text-sm">/mo</span>
          </div>
          <p className="mt-3 text-sm text-sub">
            Flexible month-to-month billing for teams scaling lead volume.
          </p>
          <div className="mt-5">
            <UpgradeButton plan="pro_month" label="Upgrade — $10/mo" />
          </div>
          <FeatureList />
        </Card>

        <Card className="relative flex flex-col p-5 md:p-6 border-green/30 ring-1 ring-green/15">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display font-semibold text-ink text-lg">Pro Yearly</h3>
            <Badge variant="success">Best value</Badge>
          </div>
          <div className="mt-3 flex items-baseline gap-1 flex-wrap">
            <span className="font-display font-bold text-3xl md:text-4xl text-ink tracking-tight">
              $100
            </span>
            <span className="text-sub text-sm">/yr</span>
          </div>
          <p className="mt-1.5 text-xs text-green-dark font-medium">Save $20 vs monthly</p>
          <p className="mt-3 text-sm text-sub">
            Pay once a year and keep Pro coverage with two months free.
          </p>
          <div className="mt-5">
            <UpgradeButton plan="pro_year" label="Upgrade — $100/yr" />
          </div>
          <FeatureList />
        </Card>
      </div>

      <p className="mt-4 text-sm text-sub">
        Sandbox billing is USD for now — NGN recurring unlocks once Bachs enables it.
      </p>
    </div>
  );
}
