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
        <p className="pill">WhatsApp · Meta · TikTok · Africa/Lagos</p>
        <h1>Ads become WhatsApp conversations.</h1>
        <p className="lede">
          Flume pulls leads from TikTok and Meta, scores them, drafts the first
          message, and keeps the close on WhatsApp. Built for Nigerian SMEs.
        </p>
        <div className="hero-actions">
          <Link className="btn primary" href="/app">Try the desk</Link>
          <Link className="btn" href="/app/billing">Plans from ₦0</Link>
        </div>
      </section>
      <section className="grid3">
        <article className="card"><h3>Extract</h3><p>Official Cloud API and lead webhooks. No unofficial WhatsApp libraries.</p></article>
        <article className="card"><h3>Score</h3><p>Explainable 0–100 score. High / medium / low on Free.</p></article>
        <article className="card"><h3>Close</h3><p>Human hits Send. Pro can auto-send after approve. Billing on Bachs in NGN.</p></article>
      </section>
      <footer className="foot">© 2026 Flume. Task-specific sales tool. Not a general WhatsApp chatbot.</footer>
    </main>
  );
}
