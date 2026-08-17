"use client";

import { useLinkStatus } from "next/link";

/** Shows immediately on tap so product / category cards don't feel frozen. */
export function PendingLinkOverlay() {
  const { pending } = useLinkStatus();
  if (!pending) return null;

  return (
    <span
      className="absolute inset-0 z-20 bg-white/50"
      aria-hidden
    />
  );
}
