import Link from "next/link";

export default function Home() {
  return (
    <main className="wrap">
      <nav className="nav">
        <div className="brand"><span className="mark">F</span>Flume</div>
        <div className="nav-actions">
          <Link className="btn ghost" href="/app">Log in</Link>
          <Link className="btn primary" href="/app">Open desk</Link>
        </div>
      </nav>

      <section className="hero">
        <h1>Increase orders and bookings from ads, <em>on WhatsApp</em></h1>
        <p className="lede">
          Flume turns TikTok and Meta leads into a scored conversation.
          You review the draft. The close stays on the number you already use.
        </p>
        <div className="hero-actions">
          <Link className="btn primary" href="/app">Open the desk</Link>
          <a className="btn" href="#how">See how it works</a>
        </div>
      </section>

      <div className="chat-stage" aria-hidden="true">
        <div className="bubble left">
          <span className="avatar a">AO</span>
          <span className="chip-text"><span className="dot" />Adaeze · high 86</span>
        </div>
        <div className="bubble right">
          <span className="chip-text">Do you have Saturday in Lekki?</span>
          <span className="avatar b">IM</span>
        </div>
        <div className="bubble mid">
          <span className="avatar c">TA</span>
          <span className="chip-text">Draft ready · send on WhatsApp</span>
        </div>
      </div>

      <section className="section center" id="how">
        <p className="muted">How Flume works</p>
        <h2>Three steps from ad to chat</h2>
        <div className="how">
          <article className="how-card">
            <div className="illus">Ads in</div>
            <h3>Leads arrive</h3>
            <p>TikTok Instant Forms, Meta Lead Ads, and Click-to-WhatsApp land in one queue.</p>
          </article>
          <article className="how-card">
            <div className="illus">Score</div>
            <h3>Flume scores them</h3>
            <p>Explainable 0–100. High / medium / low so you answer the hottest first.</p>
          </article>
          <article className="how-card">
            <div className="illus">WA</div>
            <h3>You send on WhatsApp</h3>
            <p>A draft is waiting. You edit, send, and mark won. Official Cloud API only.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="band">
          <div>
            <p className="muted">The desk</p>
            <h2>Meet the review queue</h2>
            <p className="lede" style={{ margin: "12px 0 18px", textAlign: "left" }}>
              One screen for extract quota, score, draft, and status.
              Built for an owner with a phone, not a sales team.
            </p>
            <Link className="btn primary" href="/app">Get started</Link>
          </div>
          <div className="preview">
            <div className="wa">
              <small>WhatsApp · new lead</small>
              <strong>Hi Adaeze — Saturday in Lekki is open. What time works?</strong>
            </div>
          </div>
        </div>
      </section>

      <footer className="foot">© 2026 Flume. Task-specific sales tool. Not a general WhatsApp chatbot.</footer>
    </main>
  );
}
