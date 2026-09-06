"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { MobileTopBar, MobileBottomNav, MobileMenu } from "./mobile-nav";
import type { Workspace } from "@/types";

function isFocusView(pathname: string) {
  return /^\/inbox\/[^/]+$/.test(pathname);
}

export function DashboardShell({
  children,
  workspace,
}: {
  children: React.ReactNode;
  workspace: Workspace;
}) {
  const pathname = usePathname();
  const focusView = isFocusView(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="md:flex md:h-screen">
      <Sidebar workspace={workspace} />
      <main className={focusView ? "flex-1 md:overflow-hidden" : "flex-1 overflow-y-auto pb-20 md:pb-0"}>
        {!focusView && <MobileTopBar onMenu={() => setMenuOpen(true)} />}
        {children}
        {!focusView && <MobileBottomNav />}
        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      </main>
    </div>
  );
}
