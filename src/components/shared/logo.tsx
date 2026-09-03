import Image from "next/image";
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
      <Image
        src="/brand/flume-icon.png"
        alt="Flume"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
      {withWordmark && (
        <span className="font-display font-bold text-ink" style={{ fontSize: size * 0.6 }}>
          Flume
        </span>
      )}
    </Link>
  );
}
