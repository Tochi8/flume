import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { getTenant } from "../../../../lib/store.js";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const tenant = await getTenant();
  const used = tenant.extractsUsed ?? 0;
  const limit = tenant.extractLimit ?? 50;
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const planLabel =
    tenant.plan === "pro_month" || tenant.plan === "pro_year" || tenant.plan === "pro"
      ? "Pro"
      : "Free";
  return (
    <div className="max-w-2xl mx-auto px-5 md:px-10 py-6 md:py-10">
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
      <Card className="p-5 md:p-6">
        <CardTitle className="mb-4">Upgrade to Pro</CardTitle>
        <p className="text-sm text-sub mb-4">
          Get 1,000 leads a month, priority support, and campaign-level reporting.
        </p>
        <Button>Upgrade — ₦15,000/month</Button>
      </Card>
    </div>
  );
}
