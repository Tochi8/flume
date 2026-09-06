import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="h-16 flex items-center px-6 border-b border-border bg-surface/80">
        <Link href="/">
          <Logo size={28} />
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-5 py-10">{children}</main>
    </div>
  );
}
