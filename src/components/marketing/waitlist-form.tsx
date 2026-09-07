"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, problem }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (data.error === "email_required") setError("Enter a real email address.");
        else if (data.error === "problem_required") setError("Tell us a bit about the problem. A short sentence is enough.");
        else setError("Could not join the waitlist. Try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Could not join the waitlist. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-feature border border-border bg-surface p-6 md:p-8">
        <h2 className="font-display font-semibold text-xl text-ink">You are on the list.</h2>
        <p className="mt-3 text-sub leading-relaxed">
          We will write to {email} when Flume is ready for you. Keep an eye on that inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-feature border border-border bg-surface p-6 md:p-8 space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="waitlist-email">Email</Label>
        <Input
          id="waitlist-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@business.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="waitlist-problem">What is hard about running your business on your phone or computer?</Label>
        <Textarea
          id="waitlist-problem"
          required
          rows={6}
          minLength={8}
          maxLength={2000}
          placeholder="Example: Leads from Facebook sit in WhatsApp. I forget who asked for a price and who already paid."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />
        <p className="text-xs text-faint">A few sentences is enough. This helps us build the right desk.</p>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Joining…" : "Join the waitlist"}
      </Button>
    </form>
  );
}
