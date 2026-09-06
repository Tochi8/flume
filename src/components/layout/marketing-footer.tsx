import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export function MarketingFooter() {
  return (
    <footer className="max-w-6xl mx-auto px-6 py-14">
      <Logo size={24} className="mb-3" />
      <p className="text-sm text-faint max-w-xs">
        A calm sales operating system built around WhatsApp, for SMEs across Nigeria and Africa.
      </p>
      <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-sub">
        <Link href="/privacy" className="hover:text-ink transition-colors">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-ink transition-colors">
          Terms
        </Link>
      </nav>
      <div className="mt-12 pt-6 border-t border-border text-xs text-faint">
        © 2026 Flume · Collectiv Labs. Built for Nigerian & African SMEs.
      </div>
    </footer>
  );
}
