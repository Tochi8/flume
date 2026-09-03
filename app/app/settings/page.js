import { getTenant } from "../../../lib/store";

export default function SettingsPage() {
  const tenant = getTenant();
  return (
    <>
      <h1 className="page-title">Settings</h1>
      <section className="card">
        <h3>Workspace</h3>
        <p className="muted">{tenant.workspace}</p>
        <p className="muted">Owner {tenant.name}</p>
        <p className="muted">Timezone {tenant.timezone}</p>
        <p className="muted">Plan {tenant.plan}</p>
      </section>
    </>
  );
}
