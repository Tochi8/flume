export default function IntegrationsPage() {
  return (
    <>
      <h1 className="page-title">Connect your channels</h1>
      {[
        ["WhatsApp", "Connected"],
        ["Facebook", "Connected"],
        ["Instagram", "Connected"],
        ["TikTok", "Connect"],
      ].map(([name, state]) => (
        <article key={name} className="card" style={{ marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
          <strong>{name}</strong>
          <span className={state === "Connected" ? "score high" : "badge"}>{state === "Connected" ? "✓ Connected" : "Connect"}</span>
        </article>
      ))}
    </>
  );
}
