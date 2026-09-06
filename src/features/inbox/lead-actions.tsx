"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SuggestedReply } from "@/features/conversations/suggested-reply";

export function LeadStatusActions({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function setStatus(status: "won" | "lost") {
    setBusy(status);
    setError(null);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Update failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-border space-y-2">
      <Button className="w-full" type="button" disabled={!!busy} onClick={() => setStatus("won")}>
        {busy === "won" ? "Saving…" : "Mark as Won"}
      </Button>
      <Button variant="outline" className="w-full" type="button" disabled={!!busy} onClick={() => setStatus("lost")}>
        {busy === "lost" ? "Saving…" : "Mark as Lost"}
      </Button>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export function LeadSuggestedReply({ leadId, initialText }: { leadId: string; initialText: string }) {
  const router = useRouter();

  async function onSend(text: string) {
    const res = await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sendMessage: text }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || data.error || "Send failed");
    }
    router.refresh();
  }

  return <SuggestedReply initialText={initialText} onSend={onSend} />;
}
