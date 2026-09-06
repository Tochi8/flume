import { requireSession } from "@/lib/auth/session";
import { SettingsForm } from "@/features/settings/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { tenant } = await requireSession();
  return (
    <div className="max-w-2xl mx-auto px-5 md:px-10 py-6 md:py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-[28px] text-ink">Settings</h1>
        <p className="text-sub mt-1">Workspace and account preferences.</p>
      </div>
      <SettingsForm
        workspace={tenant.workspace || ""}
        notificationEmail={tenant.notificationEmail || ""}
        ownerName={tenant.name || ""}
      />
    </div>
  );
}
