"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { bottomNavItems } from "./nav-config";
import { cn } from "@/lib/utils";

export function MobileTopBar({ title }: { title?: string }) {
  return (
    <div className="md:hidden flex items-center justify-between h-14 px-5 border-b border-border bg-surface">
      {title ? (
        <span className="font-semibold text-ink text-sm truncate">{title}</span>
      ) : (
        <span className="font-display font-bold text-ink">Flume</span>
      )}
      <Menu className="h-5 w-5 text-ink" />
    </div>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-surface border-t border-border flex items-center justify-around h-16 px-2 z-30">
      {bottomNavItems.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn("flex flex-col items-center gap-1", active ? "text-green-dark" : "text-faint")}
          >
            <Icon className="h-5 w-5" />
            <span className={cn("text-[11px]", active && "font-medium")}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
