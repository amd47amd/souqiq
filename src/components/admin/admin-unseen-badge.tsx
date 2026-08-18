"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function AdminUnseenBadge() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/unseen-orders")
      .then((response) => (response.ok ? response.json() : { count: 0 }))
      .then((data: { count?: number }) => {
        if (!cancelled) setCount(data.count ?? 0);
      })
      .catch(() => {
        if (!cancelled) setCount(0);
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (count <= 0) return null;

  return (
    <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
      {count}
    </span>
  );
}
