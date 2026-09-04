"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { sidebarNavItems, settingsNavItem } from "./nav-config";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

export function Sidebar({ workspace }: { workspace: Workspace }) {
  const pathname = usePathname();
  const pct = Math.round((workspace.planLeadsUsed / workspace.planLeadsLimit) * 100);

  return (
    <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r border-border bg-surface">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Logo />
      </div>
      <div className="px-4 py-4">
        <button className="w-full flex items-center justify-between text-sm px-3 py-2 rounded-md bg-muted text-ink">
          <span>{workspace.name}</span>
          <ChevronDown className="h-3.5 w-3.5 text-sub" />
        </button>
      </div>
      <nav className="flex-1 px-3 space-y-1 text-sm">
        {sidebarNavItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors",
                active ? "bg-green-light text-green-dark font-medium" : "text-sub hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-4">
        <Link
          href={settingsNavItem.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
            pathname === settingsNavItem.href
              ? "bg-green-light text-green-dark font-medium"
              : "text-sub hover:bg-muted"
          )}
        >
          <settingsNavItem.icon className="h-4 w-4" />
          Settings
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sub hover:bg-muted transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Link>
        <div className="mt-3 mx-1 p-3 rounded-md bg-muted">
          <div className="text-xs text-sub mb-1.5">
            {workspace.planLeadsUsed} / {workspace.planLeadsLimit} leads used
          </div>
          <div className="w-full h-1.5 rounded-pill bg-border overflow-hidden">
            <div className="h-full bg-green" style={{ width: `${pct}%` }} />
          </div>
          <Link href="/billing" className="block mt-2 text-xs font-medium text-green-dark">
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </aside>
  );
}
