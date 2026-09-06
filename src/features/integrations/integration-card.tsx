"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Integration } from "@/types";

export function ConnectionStatus({ state }: { state: Integration["state"] }) {
  const connected = state === "connected";
  return (
    <span
      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-pill ${
        connected ? "text-green-dark bg-green-light" : "text-faint bg-muted"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-dark" : "bg-faint"}`} />
      {connected ? "Connected" : "Not connected"}
    </span>
  );
}

const KIND_BY_ID: Record<string, string> = {
  int_whatsapp: "whatsapp",
  int_facebook: "facebook",
  int_instagram: "instagram",
  int_tiktok: "tiktok",
};

export function IntegrationCard({
  integration,
  icon,
}: {
  integration: Integration & { kind?: string };
  icon: React.ReactNode;
}) {
  const [state, setState] = useState(integration.state);
  const [meta, setMeta] = useState(integration.meta);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setBusy(true);
    setError(null);
    const nextConnected = state !== "connected";
    const kind = integration.kind || KIND_BY_ID[integration.id] || integration.id;
    try {
      const res = await fetch("/api/connections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          connected: nextConnected,
          externalId: nextConnected ? meta || `${integration.name} account` : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not update connection");
      }
      const data = await res.json();
      const updated = (data.connections || []).find((c: Integration) => c.id === integration.id);
      setState(updated?.state || (nextConnected ? "connected" : "not_connected"));
      setMeta(updated?.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-surface border border-border rounded-card p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-md bg-bg border border-border flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-ink">{integration.name}</div>
        <div className="text-xs text-sub mt-0.5">{integration.description}</div>
        {meta && <div className="text-xs text-faint mt-1">{meta}</div>}
        {error && <div className="text-xs text-danger mt-1">{error}</div>}
      </div>
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 shrink-0">
        <ConnectionStatus state={state} />
        <Button
          variant={state === "connected" ? "outline" : "default"}
          size="sm"
          disabled={busy}
          onClick={toggle}
        >
          {busy ? "…" : state === "connected" ? "Disconnect" : "Connect"}
        </Button>
      </div>
    </div>
  );
}
