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
      className={cn(
        "relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-foreground/75 hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
      <PendingCue />
    </Link>
  );
}
