"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function SettingsForm({
  workspace,
  notificationEmail,
  ownerName,
}: {
  workspace: string;
  notificationEmail: string;
  ownerName: string;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/tenant", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace: String(form.get("workspace-name") || ""),
          name: ownerName,
          notificationEmail: String(form.get("workspace-email") || ""),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || "Save failed");
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <form onSubmit={handleSave}>
        <Card className="p-5 md:p-6 space-y-4">
          <CardTitle className="mb-2">Workspace</CardTitle>
          <div className="space-y-1.5">
            <Label htmlFor="workspace-name">Workspace name</Label>
            <Input id="workspace-name" name="workspace-name" defaultValue={workspace} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="workspace-email">Notification email</Label>
            <Input
              id="workspace-email"
              name="workspace-email"
              type="email"
              defaultValue={notificationEmail}
              required
            />
          </div>
          <div className="pt-2 flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
            {saved && <span className="text-sm text-green-dark">Saved</span>}
            {error && <span className="text-sm text-danger">{error}</span>}
          </div>
        </Card>
      </form>

      <Card className="p-5 md:p-6 mt-4">
        <CardTitle className="mb-2">Account</CardTitle>
        <p className="text-sm text-sub mb-4">Sign out of this device.</p>
        <Button type="button" variant="outline" onClick={handleLogout}>
          Log out
        </Button>
      </Card>

      <Card className="p-5 md:p-6 mt-4">
        <CardTitle className="mb-2">Delete account</CardTitle>
        <p className="text-sm text-sub mb-4">
          Contact support to permanently delete your workspace. Self-serve delete ships later.
        </p>
        {!confirmDelete ? (
          <Button type="button" variant="outline" onClick={() => setConfirmDelete(true)}>
            Delete account
          </Button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" onClick={() => setDeleted(true)}>
              Request delete
            </Button>
            <Button type="button" variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
          </div>
        )}
        {deleted && (
          <p className="text-sm text-sub mt-3">
            Noted. Email support from your notification address to finish deletion.
          </p>
        )}
      </Card>
    </>
  );
}
