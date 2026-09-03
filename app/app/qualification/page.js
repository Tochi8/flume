export default function QualificationPage() {
  return (
    <>
      <h1 className="page-title">Qualification</h1>
      <p className="muted">Ask customers a few questions before handing them to you.</p>
      <section className="card" style={{ marginTop: 16 }}>
        <h3>Questions</h3>
        <p className="muted">1. What service do you need?</p>
        <p className="muted">2. When do you need it?</p>
        <p className="muted">3. What is your budget?</p>
        <button className="btn" style={{ marginTop: 12 }}>Add question</button>
      </section>
      <section className="card" style={{ marginTop: 12 }}>
        <h3>Bot behavior</h3>
        <p className="muted">○ Automatically qualify</p>
        <p className="muted">● Hand off to me</p>
        <button className="btn primary" style={{ marginTop: 12 }}>Save</button>
      </section>
    </>
  );
}
