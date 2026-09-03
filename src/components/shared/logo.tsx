import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  withWordmark = true,
  size = 28,
  href = "/",
  className,
}: {
  withWordmark?: boolean;
  size?: number;
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <span
        className="inline-flex items-center justify-center rounded-md bg-green text-white font-display font-bold"
        style={{ width: size, height: size, fontSize: size * 0.45 }}
      >
        F
      </span>
      {withWordmark && (
        <span className="font-display font-bold text-ink" style={{ fontSize: size * 0.6 }}>
          Flume
        </span>
      )}
    </Link>
  );
}
