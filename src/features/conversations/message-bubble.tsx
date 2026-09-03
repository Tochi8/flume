import { cn } from "@/lib/utils";
import type { Message } from "@/types";
export function MessageBubble({ message }: { message: Message }) {
  const fromAgent = message.from === "agent";
  return (
    <div className={cn("flex", fromAgent ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-xs md:max-w-sm rounded-card px-4 py-2.5 text-sm text-ink", fromAgent ? "bg-green-light rounded-br-sm" : "bg-surface border border-border rounded-bl-sm")}>
        {message.body}
        <div className={cn("text-[10px] mt-1", fromAgent ? "text-green-dark/70 text-right" : "text-faint")}>{message.sentAt}</div>
      </div>
    </div>
  );
}
