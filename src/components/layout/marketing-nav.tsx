import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo size={28} />
        <nav className="hidden md:flex items-center gap-8 text-sm text-sub">
          <Link href="#how-it-works" className="hover:text-ink transition-colors">How it works</Link>
          <Link href="#intelligence" className="hover:text-ink transition-colors">Lead intelligence</Link>
          <Link href="#pricing" className="hover:text-ink transition-colors">Pricing</Link>
          <Link href="#faq" className="hover:text-ink transition-colors">FAQ</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/overview" className="hidden sm:inline text-sm text-sub hover:text-ink transition-colors">Log in</Link>
          <Button asChild size="sm">
            <Link href="/overview">Start for free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
