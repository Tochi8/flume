"use client";

import Link from "next/link";
import { useState } from "react";
import { listLeads } from "../../../lib/store";

const FILTERS = ["all", "new", "qualified", "contacted", "won", "lost", "junk"];

export default function LeadsPage() {
  const [filter, setFilter] = useState("all");
  const leads = listLeads().filter((l) => filter === "all" || l.status === filter);
  return (
    <>
      <h1 className="page-title">Leads</h1>
      <div className="actions" style={{ marginBottom: 14 }}>
        {FILTERS.map((f) => (
          <button key={f} className={filter === f ? "btn primary" : "btn"} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      {leads.map((lead) => (
        <Link key={lead.id} href={`/app/inbox?lead=${lead.id}`} className="lead-card" style={{ display: "block", marginBottom: 10 }}>
          <p><strong>{lead.name}</strong> · {lead.phoneE164}</p>
          <p className={`score ${lead.band}`}>High intent · Score {lead.score}</p>
          <p className="muted">“{lead.excerpt}”</p>
          <p className="tiny">{lead.status} · {lead.extractedAt}</p>
        </Link>
      ))}
    </>
  );
}
