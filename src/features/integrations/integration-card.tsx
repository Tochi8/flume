"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Integration } from "@/types";
export function ConnectionStatus({ state }: { state: Integration["state"] }) {
  const connected = state === "connected";
  return (
    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-pill ${connected ? "text-green-dark bg-green-light" : "text-faint bg-muted"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-dark" : "bg-faint"}`} />
      {connected ? "Connected" : "Not connected"}
    </span>
  );
}
export function IntegrationCard({ integration, icon }: { integration: Integration; icon: React.ReactNode }) {
  const [state, setState] = useState(integration.state);
  return (
    <div className="bg-surface border border-border rounded-card p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-md bg-bg border border-border flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-ink">{integration.name}</div>
        <div className="text-xs text-sub mt-0.5">{integration.description}</div>
        {integration.meta && <div className="text-xs text-faint mt-1">{integration.meta}</div>}
      </div>
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 shrink-0">
        <ConnectionStatus state={state} />
        <Button variant={state === "connected" ? "outline" : "default"} size="sm" onClick={() => setState((s) => (s === "connected" ? "not_connected" : "connected"))}>
          {state === "connected" ? "Manage" : "Connect"}
        </Button>
      </div>
    </div>
  );
}
