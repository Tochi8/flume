"use client";
import { useState } from "react";
import { Plus, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { QualificationBotBehavior, QualificationQuestion } from "@/types";

export function QualificationQuestionList({ initialQuestions }: { initialQuestions: QualificationQuestion[] }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [editingId, setEditingId] = useState<string | null>(null);
  function updatePrompt(id: string, prompt: string) { setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, prompt } : q))); }
  function removeQuestion(id: string) { setQuestions((qs) => qs.filter((q) => q.id !== id).map((q, i) => ({ ...q, order: i + 1 }))); }
  function addQuestion() { const id = `q_${Date.now()}`; setQuestions((qs) => [...qs, { id, order: qs.length + 1, prompt: "" }]); setEditingId(id); }
  return (
    <div>
      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.id} className="flex items-center gap-3 border border-border rounded-md p-3">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-sub shrink-0">{q.order}</span>
            {editingId === q.id ? (
              <Input autoFocus value={q.prompt} onChange={(e) => updatePrompt(q.id, e.target.value)} onBlur={() => setEditingId(null)} className="h-9 flex-1" placeholder="Type a question…" />
            ) : (
              <span className="text-sm text-ink flex-1">{q.prompt || "Untitled question"}</span>
            )}
            <button className="text-faint hover:text-ink" onClick={() => setEditingId(editingId === q.id ? null : q.id)} aria-label="Edit question"><Pencil className="h-4 w-4" /></button>
            <button className="text-faint hover:text-danger" onClick={() => removeQuestion(q.id)} aria-label="Remove question"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      <Button variant="link" className="mt-4 gap-1.5 text-green-dark" onClick={addQuestion}><Plus className="h-4 w-4" />Add question</Button>
    </div>
  );
}

export function BotBehaviorPicker({ initial }: { initial: QualificationBotBehavior }) {
  const [behavior, setBehavior] = useState<QualificationBotBehavior>(initial);
  const options: { value: QualificationBotBehavior; title: string; description: string }[] = [
    { value: "auto_qualify", title: "Automatically qualify", description: "Flume scores the answers and updates the lead's status on its own." },
    { value: "hand_off", title: "Hand off to me", description: "Flume collects the answers and lets you make the final call." },
  ];
  return (
    <div className="space-y-3">
      {options.map((opt) => (
        <label key={opt.value} className={`flex items-start gap-3 border rounded-md p-3 cursor-pointer transition-colors ${behavior === opt.value ? "border-green bg-green-surface" : "border-border"}`}>
          <input type="radio" name="behavior" checked={behavior === opt.value} onChange={() => setBehavior(opt.value)} className="mt-1 accent-green" />
          <span>
            <span className="block text-sm font-medium text-ink">{opt.title}</span>
            <span className="block text-xs text-sub mt-0.5">{opt.description}</span>
          </span>
        </label>
      ))}
    </div>
  );
}
