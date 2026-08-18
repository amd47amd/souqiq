"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

function PendingCue() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <span
      className="ml-auto size-1.5 shrink-0 animate-pulse rounded-full bg-primary"
      aria-hidden
    />
  );
}

export function AdminNavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      prefetch
      className={cn(
        "relative inline-flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
        active
          ? "bg-[#eef3ff] text-primary"
          : "text-foreground/70 hover:bg-muted hover:text-foreground",
      )}
    >
      {active ? (
        <span className="absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-full bg-primary lg:block hidden" />
      ) : null}
      {children}
      <PendingCue />
    </Link>
  );
}
