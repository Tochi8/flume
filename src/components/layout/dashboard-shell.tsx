"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { MobileTopBar, MobileBottomNav } from "./mobile-nav";
import type { Workspace } from "@/types";

const currentWorkspace: Workspace = {
  id: "ws_1",
  name: "Adire & Co.",
  planLeadsUsed: 43,
  planLeadsLimit: 50,
};

function isFocusView(pathname: string) {
  return /^\/inbox\/[^/]+$/.test(pathname);
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const focusView = isFocusView(pathname);

  return (
    <div className="md:flex md:h-screen">
      <Sidebar workspace={currentWorkspace} />
      <main className={focusView ? "flex-1 md:overflow-hidden" : "flex-1 overflow-y-auto pb-20 md:pb-0"}>
        {!focusView && <MobileTopBar />}
        {children}
        {!focusView && <MobileBottomNav />}
      </main>
    </div>
  );
}
