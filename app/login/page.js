import Link from "next/link";

export default function Login() {
  return (
    <main className="wrap" style={{ maxWidth: 480 }}>
      <Link className="brand" href="/"><span className="mark">F</span>Flume</Link>
      <h1 className="page-title" style={{ marginTop: 28 }}>Log in</h1>
      <form action="/app" style={{ display: "grid", gap: 10, marginTop: 20 }}>
        <input name="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <button className="btn primary" type="submit">Open desk</button>
      </form>
    </main>
  );
}
