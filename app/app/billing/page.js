"use client";

import Link from "next/link";
import { useState } from "react";
import { getTenant } from "../../../lib/store";

export default function Billing() {
  const tenant = getTenant();
  const [msg, setMsg] = useState("");

  async function upgrade(plan) {
    setMsg("Opening Bachs checkout…");
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, email: "owner@flume.local", name: tenant.name }),
    });
    const data = await res.json();
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
      return;
    }
    setMsg(data.hint || data.error || "Checkout not configured yet.");
  }

  return (
    <main className="wrap">
      <nav className="nav">
        <Link className="brand" href="/"><span className="mark">F</span>Flume</Link>
        <Link className="btn" href="/app">Back to desk</Link>
      </nav>
      <h1>Plans</h1>
      <p className="lede">Bachs handles NGN cards and bank transfer. Quota resets on the 1st, Africa/Lagos.</p>
      <section className="grid3" style={{ marginTop: 20 }}>
        <article className="card">
          <h3>Free</h3>
          <p><strong>₦0</strong> · 50 extracts</p>
          <p className="muted">Current plan if you have not paid.</p>
        </article>
        <article className="card">
          <h3>Pro monthly</h3>
          <p><strong>₦15,000</strong> / month · 1,000 extracts</p>
          <button className="btn primary" onClick={() => upgrade("month")}>Pay with Bachs</button>
        </article>
        <article className="card">
          <h3>Pro yearly</h3>
          <p><strong>₦150,000</strong> / year · 1,000 / month</p>
          <button className="btn" onClick={() => upgrade("year")}>Pay with Bachs</button>
        </article>
      </section>
      {msg && <p className="muted" style={{ marginTop: 16 }}>{msg}</p>}
      <p className="muted" style={{ marginTop: 16 }}>Workspace plan right now: {tenant.plan}.</p>
    </main>
  );
}
