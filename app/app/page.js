"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getTenant, listLeads, updateLead } from "../../lib/store";

export default function Desk() {
  const tenant = getTenant();
  const [leads, setLeads] = useState(listLeads());
  const [activeId, setActiveId] = useState(leads[0]?.id);
  const active = useMemo(() => leads.find((l) => l.id === activeId) || leads[0], [leads, activeId]);

  function setStatus(status) {
    const next = updateLead(active.id, { status });
    setLeads(listLeads());
    setActiveId(next.id);
  }

  return (
    <main className="wrap">
      <nav className="nav">
        <Link className="brand" href="/"><span className="mark">F</span>Flume</Link>
        <div className="nav-actions">
          <Link className="btn" href="/app/billing">{tenant.plan === "free" ? "Upgrade" : "Billing"}</Link>
        </div>
      </nav>
      <header className="desk-head">
        <div>
          <p className="pill">{tenant.name} · {tenant.plan}</p>
          <h1>Review queue</h1>
        </div>
      </header>
      <section className="stats">
        <div className="stat"><span className="muted">Extracts this month</span><b>{tenant.extractsUsed}/{tenant.extractLimit}</b></div>
        <div className="stat"><span className="muted">New</span><b>{leads.filter((l) => l.status === "new").length}</b></div>
        <div className="stat"><span className="muted">Qualified</span><b>{leads.filter((l) => l.status === "qualified").length}</b></div>
        <div className="stat"><span className="muted">Won</span><b>{leads.filter((l) => l.status === "won").length}</b></div>
      </section>
      <section className="row">
        <div className="card">
          {leads.map((lead) => (
            <button key={lead.id} className="lead" onClick={() => setActiveId(lead.id)} style={{ width: "100%", textAlign: "left", background: "transparent", borderLeft: 0, borderRight: 0, borderTop: 0 }}>
              <div className="lead-top">
                <strong>{lead.name}</strong>
                <span className={`band ${lead.band}`}>{lead.band} {lead.score}</span>
              </div>
              <p className="muted">{lead.source} · {lead.phoneE164}</p>
            </button>
          ))}
        </div>
        {active && (
          <div className="card">
            <p className="pill">{active.campaign}</p>
            <h2>{active.name}</h2>
            <p className="muted">{active.phoneE164}</p>
            <p className="muted">Reasons: {active.reasons.join(", ")}</p>
            <label className="muted" style={{ display: "grid", gap: 6, marginTop: 12 }}>
              Outreach draft
              <textarea className="draft" defaultValue={active.draft} key={active.id} />
            </label>
            <div className="actions">
              <button className="btn primary" onClick={() => setStatus("contacted")}>Mark sent</button>
              <button className="btn" onClick={() => setStatus("qualified")}>Qualified</button>
              <button className="btn" onClick={() => setStatus("won")}>Won</button>
              <button className="btn ghost" onClick={() => setStatus("junk")}>Junk</button>
            </div>
            <p className="muted" style={{ marginTop: 12 }}>Send still needs a connected WhatsApp Cloud API number.</p>
          </div>
        )}
      </section>
    </main>
  );
}
