import Link from "next/link";

export default function Home() {
  return (
    <main className="wrap">
      <nav className="nav">
        <div className="brand"><span className="mark">F</span>Flume</div>
        <div className="nav-actions">
          <Link className="btn ghost" href="/login">Log in</Link>
          <Link className="btn primary" href="/signup">Start for free</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="kicker">WhatsApp-first sales desk</p>
            <h1 className="display">Turn WhatsApp conversations into customers.</h1>
            <p className="lede">
              Flume captures leads from your Meta and TikTok campaigns, scores them,
              helps qualify them, and gives you everything you need to close the deal.
            </p>
            <div className="hero-actions">
              <Link className="btn primary" href="/signup">Start for free</Link>
              <a className="btn" href="#how">See how it works</a>
            </div>
          </div>
          <aside className="proof">
            <p className="tiny">Flume</p>
            <b>127 leads</b>
            <p className="muted">+18% qualified</p>
            <ul>
              <li>● 34 High intent</li>
              <li>● 51 Medium</li>
              <li>● 42 Low</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section" id="how">
        <p className="kicker">How Flume works</p>
        <h2>Connect. Capture. Qualify. Convert.</h2>
        <div className="steps">
          <article className="step"><h3>Connect</h3><p className="muted">WhatsApp Cloud API, Meta, and TikTok. Official channels only.</p></article>
          <article className="step"><h3>Capture</h3><p className="muted">Instant Forms and Click-to-WhatsApp land in one queue in seconds.</p></article>
          <article className="step"><h3>Qualify</h3><p className="muted">A short WhatsApp flow. Score 0–100 with reasons you can read.</p></article>
          <article className="step"><h3>Convert</h3><p className="muted">Suggested reply, cost estimate, you hit Send.</p></article>
        </div>
      </section>

      <section className="section">
        <div className="green-panel">
          <p className="kicker">Lead intelligence</p>
          <h2>Know who to answer first</h2>
          <p className="muted">High / medium / low on Free. Full 0–100 and reasons on Pro.</p>
        </div>
      </section>

      <section className="section" id="pricing">
        <p className="kicker">Pricing</p>
        <h2>Nigeria-first. Bachs checkout.</h2>
        <div className="plans">
          <article className="plan">
            <h3>Free</h3>
            <p className="price">₦0</p>
            <p className="muted">50 leads / month</p>
            <Link className="btn" href="/signup" style={{ marginTop: 14 }}>Start free</Link>
          </article>
          <article className="plan featured">
            <h3>Pro Monthly</h3>
            <p className="price">₦15,000</p>
            <p className="muted">1,000 leads / month</p>
            <Link className="btn primary" href="/app/billing" style={{ marginTop: 14 }}>Start Pro</Link>
          </article>
          <article className="plan">
            <h3>Pro Yearly</h3>
            <p className="price">₦150,000</p>
            <p className="muted">₦12,500 / month · 2 months free</p>
            <Link className="btn" href="/app/billing" style={{ marginTop: 14 }}>Save with yearly</Link>
          </article>
        </div>
      </section>

      <section className="section">
        <h2>FAQ</h2>
        <article className="faq"><h3>Do you use unofficial WhatsApp tools?</h3><p className="muted">No. Cloud API only.</p></article>
        <article className="faq"><h3>What happens when I hit 50 leads?</h3><p className="muted">New extraction pauses. Existing chats keep working. Upgrade to Pro anytime.</p></article>
        <article className="faq"><h3>How do I pay?</h3><p className="muted">Bachs. NGN cards and bank transfer.</p></article>
      </section>

      <section className="final-cta">
        <h2>Start closing on WhatsApp today</h2>
        <p>Free for 50 extracts. No card required.</p>
        <Link className="btn" href="/signup">Start for free</Link>
      </section>
      <footer className="foot">© 2026 Flume. Task-specific sales tool. Not a general chatbot.</footer>
    </main>
  );
}
