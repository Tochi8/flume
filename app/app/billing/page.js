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
      <section className="hero" style={{ paddingTop: 8 }}>
        <h1>Plans that pay for one extra booking</h1>
        <p className="lede">Bachs takes NGN cards and bank transfer. Quota resets on the 1st, Africa/Lagos.</p>
      </section>
      <section className="plans">
        <article className="plan">
          <h3>Free</h3>
          <p className="price">₦0</p>
          <p className="muted">50 extracts · 1 WhatsApp number</p>
        </article>
        <article className="plan featured">
          <h3>Pro monthly</h3>
          <p className="price">₦15,000</p>
          <p className="muted">1,000 extracts · full score + auto-send after approve</p>
          <button className="btn primary" style={{ marginTop: 16 }} onClick={() => upgrade("month")}>Pay with Bachs</button>
        </article>
        <article className="plan">
          <h3>Pro yearly</h3>
          <p className="price">₦150,000</p>
          <p className="muted">Same Pro limits. Two months free.</p>
          <button className="btn" style={{ marginTop: 16 }} onClick={() => upgrade("year")}>Pay with Bachs</button>
        </article>
      </section>
      {msg && <p className="muted" style={{ marginTop: 16, textAlign: "center" }}>{msg}</p>}
      <p className="muted" style={{ marginTop: 16, textAlign: "center" }}>Workspace plan right now: {tenant.plan}.</p>
    </main>
  );
}
