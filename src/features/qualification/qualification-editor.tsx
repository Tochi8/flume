"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { QualificationQuestionList, BotBehaviorPicker } from "@/features/qualification/qualification-flow";
import type { QualificationBotBehavior, QualificationConfig, QualificationQuestion } from "@/types";

export function QualificationEditor({ initial }: { initial: QualificationConfig }) {
  const questionsRef = useRef<QualificationQuestion[]>(initial.questions);
  const behaviorRef = useRef<QualificationBotBehavior>(initial.behavior);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Lifted state via wrappers
  const [questions, setQuestions] = useState(initial.questions);
  const [behavior, setBehavior] = useState(initial.behavior);

  async function save() {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/qualification", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions, behavior }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || "Save failed");
      setMessage("Saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Card className="p-5 md:p-6 mb-6">
        <CardTitle className="mb-4">Questions</CardTitle>
        <QualificationQuestionList
          initialQuestions={questions}
          onChange={(qs) => {
            questionsRef.current = qs;
            setQuestions(qs);
          }}
        />
      </Card>
      <Card className="p-5 md:p-6 mb-6">
        <CardTitle className="mb-1">Bot behavior</CardTitle>
        <p className="text-sm text-sub mb-4">Choose what happens once a customer finishes answering.</p>
        <BotBehaviorPicker
          initial={behavior}
          onChange={(b) => {
            behaviorRef.current = b;
            setBehavior(b);
          }}
        />
      </Card>
      <div className="flex items-center gap-3">
        <Button className="w-full sm:w-auto" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
        {message && <span className="text-sm text-green-dark">{message}</span>}
        {error && <span className="text-sm text-danger">{error}</span>}
      </div>
    </>
  );
}
