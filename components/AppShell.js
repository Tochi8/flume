"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getTenant } from "../lib/store";

const LINKS = [
  ["/app", "Overview"],
  ["/app/leads", "Leads"],
  ["/app/inbox", "Inbox"],
  ["/app/qualification", "Qualification"],
  ["/app/integrations", "Campaigns"],
  ["/app/billing", "Billing"],
  ["/app/settings", "Settings"],
];

const MOBILE = [
  ["/app", "Home"],
  ["/app/leads", "Leads"],
  ["/app/inbox", "Inbox"],
  ["/app/billing", "Analytics"],
  ["/app/settings", "More"],
];

export default function AppShell({ children }) {
  const path = usePathname();
  const tenant = getTenant();
  return (
    <div className="shell">
      <aside className="side">
        <Link className="brand" href="/" style={{ marginBottom: 18 }}><span className="mark">F</span>Flume</Link>
        <p className="tiny" style={{ paddingLeft: 12 }}>{tenant.workspace}</p>
        {LINKS.map(([href, label]) => (
          <Link key={href} href={href} className={path === href ? "on" : ""}>{label}</Link>
        ))}
      </aside>
      <div className="main">{children}</div>
      <nav className="mobile-nav">
        {MOBILE.map(([href, label]) => (
          <Link key={href} href={href} className={path === href ? "on" : ""}>{label}</Link>
        ))}
      </nav>
    </div>
  );
}
