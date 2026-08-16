import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  actionHref = "/products",
  actionLabel = "Browse products",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] border border-border/70 bg-gradient-to-b from-white to-[#f5f7fb] px-6 py-14 text-center sm:px-10 sm:py-16",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(26,86,219,0.08),transparent_55%)]"
      />
      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10">
          {icon}
        </div>
        <h2 className="mt-5 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          {description}
        </p>
        {actionHref ? (
          <Button asChild className="mt-7 h-11 px-6">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
