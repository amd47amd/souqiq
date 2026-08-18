"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
        "flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm font-medium whitespace-nowrap outline-none transition-colors",
        "[-webkit-tap-highlight-color:transparent] lg:w-full lg:px-2.5 lg:py-1.5",
        active
          ? "bg-[#eef3ff] text-primary"
          : "text-muted-foreground hover:bg-[#f4f6f9] hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
