"use client";

import { useState } from "react";
import { getTenant } from "../../../lib/store";

export default function BillingPage() {
  const tenant = getTenant();
  const [msg, setMsg] = useState("");
  const left = tenant.extractLimit - tenant.extractsUsed;

  async function upgrade(plan) {
    setMsg("Opening Bachs checkout…");
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, email: "tolu@flume.local", name: tenant.workspace }),
    });
    const data = await res.json();
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
      return;
    }
    setMsg(data.hint || data.error || "Add Bachs keys to go live.");
  }

  return (
    <>
      <h1 className="page-title">Billing</h1>
      <div className="quota">
        <p><strong>{tenant.extractsUsed} / {tenant.extractLimit} leads used</strong></p>
        <p className="muted">You have {left} lead extractions remaining this month.</p>
        <div className="bar"><span style={{ width: `${(tenant.extractsUsed / tenant.extractLimit) * 100}%` }} /></div>
        <p className="tiny">Resets Oct 1</p>
      </div>
      <div className="plans">
        <article className="plan"><h3>Free</h3><p className="price">₦0</p><p className="muted">50 leads / month</p></article>
        <article className="plan featured">
          <h3>Pro Monthly</h3>
          <p className="price">₦15,000</p>
          <p className="muted">1,000 leads / month</p>
          <button className="btn primary" onClick={() => upgrade("month")}>Start Pro</button>
        </article>
        <article className="plan">
          <h3>Pro Yearly</h3>
          <p className="price">₦150,000</p>
          <p className="muted">₦12,500 / month</p>
          <button className="btn" onClick={() => upgrade("year")}>Save with yearly</button>
        </article>
      </div>
      {msg && <p className="muted" style={{ marginTop: 14 }}>{msg}</p>}
    </>
  );
}
