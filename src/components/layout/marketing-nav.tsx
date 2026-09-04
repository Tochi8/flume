"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#intelligence", label: "Lead intelligence" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo size={28} />
        <nav className="hidden md:flex items-center gap-8 text-sm text-sub">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/overview" className="hidden sm:inline text-sm text-sub hover:text-ink transition-colors">
            Log in
          </Link>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/overview">Start for free</Link>
          </Button>
          <button
            type="button"
            className="md:hidden p-1"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5 text-ink" /> : <Menu className="h-5 w-5 text-ink" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-surface px-6 py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm text-ink py-1"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/overview" className="block text-sm text-sub py-1" onClick={() => setOpen(false)}>
            Log in
          </Link>
          <Button asChild className="w-full" onClick={() => setOpen(false)}>
            <Link href="/overview">Start for free</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
