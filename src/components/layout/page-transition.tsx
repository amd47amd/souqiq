import type { ReactNode } from "react";

/** Instant paint — no fade-in that makes the whole page feel late. */
export function PageTransition({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
