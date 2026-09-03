import Link from "next/link";

export default function Signup() {
  return (
    <main className="wrap" style={{ maxWidth: 480 }}>
      <Link className="brand" href="/"><span className="mark">F</span>Flume</Link>
      <h1 className="page-title" style={{ marginTop: 28 }}>Start for free</h1>
      <p className="muted">50 extracts. Africa/Lagos. No card.</p>
      <form action="/app" style={{ display: "grid", gap: 10, marginTop: 20 }}>
        <input name="name" placeholder="Your name" defaultValue="Tolu" />
        <input name="email" placeholder="Work email" />
        <input name="business" placeholder="Business name" />
        <button className="btn primary" type="submit">Create workspace</button>
      </form>
      <p className="tiny" style={{ marginTop: 14 }}>Already here? <Link href="/login">Log in</Link></p>
    </main>
  );
}
