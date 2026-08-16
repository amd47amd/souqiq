"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms */
  delay?: number;
  /** Softer / shorter travel */
  subtle?: boolean;
};

/**
 * Scroll reveal: content rises into view once.
 * Stays visible by default until JS mounts (no blank flash), then
 * animates only if the block is still below the fold.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  subtle = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"pending" | "hidden" | "shown">("pending");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setState("shown");
      return;
    }

    const rect = el.getBoundingClientRect();
    const belowFold = rect.top > window.innerHeight * 0.88;

    if (!belowFold) {
      setState("shown");
      return;
    }

    setState("hidden");

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "reveal",
        subtle && "reveal-subtle",
        state === "hidden" && "reveal-hidden",
        state === "shown" && "reveal-shown",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
