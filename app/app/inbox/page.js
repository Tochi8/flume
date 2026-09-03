"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { listLeads, updateLead } from "../../../lib/store";

function InboxInner() {
  const params = useSearchParams();
  const leads = listLeads();
  const [id, setId] = useState(params.get("lead") || leads[0].id);
  const lead = useMemo(() => leads.find((l) => l.id === id) || leads[0], [id, leads]);
  const [draft, setDraft] = useState(lead.draft);

  function select(next) {
    setId(next.id);
    setDraft(next.draft);
  }

  return (
    <>
      <h1 className="page-title">Inbox</h1>
      <div className="row3">
        <div>
          {leads.map((item) => (
            <button key={item.id} className={item.id === lead.id ? "lead-card active" : "lead-card"} onClick={() => select(item)} style={{ marginBottom: 8 }}>
              <strong>{item.name}</strong>
              <p className={`score ${item.band}`}>{item.score} · {item.band}</p>
              <p className="muted">{item.excerpt}</p>
            </button>
          ))}
        </div>
        <div className="panel">
          <p className="tiny">WhatsApp conversation</p>
          <div className="bubble">{lead.excerpt}</div>
          <div className="bubble you">{draft}</div>
          <p className="tiny" style={{ marginTop: 12 }}>Suggested reply</p>
          <textarea className="draft" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <p className="muted" style={{ marginTop: 8 }}>Estimated WhatsApp cost ≈ ₦{lead.costNgn}</p>
          <div className="actions">
            <button className="btn" onClick={() => setDraft(lead.draft)}>Edit message</button>
            <button className="btn primary" onClick={() => updateLead(lead.id, { status: "contacted", draft })}>Send</button>
          </div>
        </div>
        <div className="panel">
          <p className="tiny">Flume intelligence</p>
          <p className={`score ${lead.band}`}>Score {lead.score} · {lead.band.toUpperCase()}</p>
          <p className="muted">Intent: {lead.intent}</p>
          <p className="muted">Reason: {lead.reasons.join(", ")}</p>
          <p className="muted">Source: {lead.source}</p>
        </div>
      </div>
    </>
  );
}

export default function InboxPage() {
  return (
    <Suspense fallback={<p className="muted">Loading inbox…</p>}>
      <InboxInner />
    </Suspense>
  );
}
