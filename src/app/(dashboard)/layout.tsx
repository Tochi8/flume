import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireSession } from "@/lib/auth/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireSession();
  const workspace = {
    id: ctx.tenantId,
    name: ctx.tenant.workspace || ctx.tenant.name || "Workspace",
    planLeadsUsed: ctx.tenant.extractsUsed ?? 0,
    planLeadsLimit: ctx.tenant.extractLimit ?? 50,
  };
  return <DashboardShell workspace={workspace}>{children}</DashboardShell>;
}
