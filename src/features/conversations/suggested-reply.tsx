"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { WhatsAppCostEstimate } from "./whatsapp-cost-estimate";

const replySchema = z.object({ body: z.string().min(1, "Message can't be empty") });
type ReplyForm = z.infer<typeof replySchema>;

export function SuggestedReply({
  initialText,
  onSend,
}: {
  initialText: string;
  onSend?: (text: string) => void | Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ReplyForm>({
    resolver: zodResolver(replySchema),
    defaultValues: { body: initialText },
  });

  const submit = handleSubmit(async (data) => {
    setSending(true);
    setError(null);
    try {
      await onSend?.(data.body);
      setSent(true);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
    } finally {
      setSending(false);
    }
  });

  return (
    <div className="border-t border-border bg-surface p-4 md:p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded-full bg-green flex items-center justify-center shrink-0">
          <Sparkles className="h-2.5 w-2.5 text-white" />
        </div>
        <span className="text-sm font-medium text-ink">Piper suggestion</span>
      </div>
      {editing ? (
        <form onSubmit={submit}>
          <Textarea {...register("body")} className="text-sm" rows={4} />
          {errors.body && <p className="text-xs text-danger mt-1">{errors.body.message}</p>}
          {error && <p className="text-xs text-danger mt-1">{error}</p>}
          <div className="flex items-center justify-between mt-3">
            <WhatsAppCostEstimate />
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={sending}>
                {sending ? "Sending…" : "Send"}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <>
          <div className="border border-border rounded-card p-4 text-sm text-ink leading-relaxed bg-bg">
            {getValues("body") || initialText}
          </div>
          <div className="flex items-center justify-between mt-3">
            <WhatsAppCostEstimate />
            {sent ? (
              <span className="text-xs font-medium text-green-dark">Sent</span>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  Edit message
                </Button>
                <Button size="sm" onClick={submit} disabled={sending}>
                  {sending ? "Sending…" : "Send"}
                </Button>
              </div>
            )}
          </div>
          {error && <p className="text-xs text-danger mt-2">{error}</p>}
        </>
      )}
    </div>
  );
}
