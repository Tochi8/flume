import Link from "next/link";
import { getTenant, listLeads } from "../../lib/store";

export default function Overview() {
  const tenant = getTenant();
  const leads = listLeads();
  const left = tenant.extractLimit - tenant.extractsUsed;
  const pct = Math.round((tenant.extractsUsed / tenant.extractLimit) * 100);
  return (
    <>
      <p className="muted">Good morning, {tenant.name}</p>
      <h1 className="page-title">Here is what is happening with your leads</h1>
      <div className="quota">
        <p><strong>{tenant.extractsUsed} / {tenant.extractLimit} leads used</strong></p>
        <p className="muted">You have {left} lead extractions remaining this month.</p>
        <div className="bar"><span style={{ width: `${pct}%` }} /></div>
        <p className="tiny">Resets Oct 1 · Africa/Lagos</p>
        <Link className="btn primary" href="/app/billing" style={{ marginTop: 12 }}>Upgrade to Pro</Link>
      </div>
      <section className="stats">
        <div className="stat"><span className="muted">Leads</span><b>127</b></div>
        <div className="stat"><span className="muted">Replied</span><b>68%</b></div>
        <div className="stat"><span className="muted">Won</span><b>21</b></div>
      </section>
      <section className="card">
        <h3>Recent leads</h3>
        {leads.map((lead) => (
          <Link key={lead.id} href={`/app/inbox?lead=${lead.id}`} className="lead-card" style={{ display: "block", marginTop: 10 }}>
            <strong>{lead.name}</strong> <span className={`score ${lead.band}`}>{lead.score} · {lead.band}</span>
            <p className="muted">{lead.status} · {lead.extractedAt}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
