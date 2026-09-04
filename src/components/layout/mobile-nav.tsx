"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Inbox, BarChart3, Menu, X } from "lucide-react";
import { moreMenuItems } from "./nav-config";
import { cn } from "@/lib/utils";

function isLeadList(pathname: string) {
  return pathname === "/inbox";
}

function isConversation(pathname: string) {
  return /^\/inbox\/[^/]+$/.test(pathname);
}

export function MobileTopBar({
  title,
  onMenu,
}: {
  title?: string;
  onMenu?: () => void;
}) {
  return (
    <div className="md:hidden flex items-center justify-between h-14 px-5 border-b border-border bg-surface">
      {title ? (
        <span className="font-semibold text-ink text-sm truncate">{title}</span>
      ) : (
        <span className="font-display font-bold text-ink">Flume</span>
      )}
      <button type="button" onClick={onMenu} aria-label="Open menu" className="p-1 -mr-1">
        <Menu className="h-5 w-5 text-ink" />
      </button>
    </div>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const items = [
    { label: "Home", href: "/overview", icon: Home, active: pathname === "/overview" },
    { label: "Leads", href: "/inbox", icon: Users, active: isLeadList(pathname) },
    { label: "Inbox", href: "/inbox/lead_1", icon: Inbox, active: isConversation(pathname) },
    { label: "Analytics", href: "/campaigns", icon: BarChart3, active: pathname === "/campaigns" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-surface border-t border-border flex items-center justify-around h-16 px-2 z-30">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn("flex flex-col items-center gap-1 min-w-[56px]", item.active ? "text-green-dark" : "text-faint")}
          >
            <Icon className="h-5 w-5" />
            <span className={cn("text-[11px]", item.active && "font-medium")}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50">
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close menu" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-[80%] max-w-xs bg-surface shadow-card flex flex-col">
        <div className="h-14 px-5 flex items-center justify-between border-b border-border">
          <span className="font-display font-bold text-ink">Menu</span>
          <button type="button" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5 text-ink" />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {moreMenuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-md text-sm",
                  active ? "bg-green-light text-green-dark font-medium" : "text-ink hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
