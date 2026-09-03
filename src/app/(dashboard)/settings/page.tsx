import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 md:px-10 py-6 md:py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-[28px] text-ink">Settings</h1>
        <p className="text-sub mt-1">Workspace and account preferences.</p>
      </div>
      <Card className="p-5 md:p-6 space-y-4">
        <CardTitle className="mb-2">Workspace</CardTitle>
        <div className="space-y-1.5"><Label htmlFor="workspace-name">Workspace name</Label><Input id="workspace-name" defaultValue="Adire & Co." /></div>
        <div className="space-y-1.5"><Label htmlFor="workspace-email">Notification email</Label><Input id="workspace-email" type="email" defaultValue="tolu@adireandco.com" /></div>
      </Card>
    </div>
  );
}
