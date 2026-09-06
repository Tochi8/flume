"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function LogoutButton({
  className,
  label = "Log out",
  onDone,
}: {
  className?: string;
  label?: string;
  onDone?: () => void;
}) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    onDone?.();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sub hover:bg-muted transition-colors w-full text-left",
        className
      )}
    >
      <LogOut className="h-4 w-4" />
      {label}
    </button>
  );
}
