"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-10 py-6 md:py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-[28px] text-ink">Settings</h1>
        <p className="text-sub mt-1">Workspace and account preferences.</p>
      </div>
      <form onSubmit={handleSave}>
        <Card className="p-5 md:p-6 space-y-4">
          <CardTitle className="mb-2">Workspace</CardTitle>
          <div className="space-y-1.5">
            <Label htmlFor="workspace-name">Workspace name</Label>
            <Input id="workspace-name" name="workspace-name" defaultValue="Adire & Co." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="workspace-email">Notification email</Label>
            <Input id="workspace-email" name="workspace-email" type="email" defaultValue="tolu@adireandco.com" />
          </div>
          <div className="pt-2 flex items-center gap-3">
            <Button type="submit">Save changes</Button>
            {saved && <span className="text-sm text-green-dark">Saved. Backend wiring comes next.</span>}
          </div>
        </Card>
      </form>
      <Card className="p-5 md:p-6 mt-4">
        <CardTitle className="mb-2">Delete account</CardTitle>
        <p className="text-sm text-sub mb-4">
          This removes the workspace and its leads. It cannot be undone once the backend is live.
        </p>
        {!confirmDelete ? (
          <Button type="button" variant="outline" onClick={() => setConfirmDelete(true)}>
            Delete account
          </Button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" onClick={() => setDeleted(true)}>
              Yes, delete account
            </Button>
            <Button type="button" variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
          </div>
        )}
        {deleted && (
          <p className="text-sm text-sub mt-3">Account delete is recorded here. Backend wiring comes next.</p>
        )}
      </Card>
    </div>
  );
}
