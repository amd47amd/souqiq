"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ErrorFallback({
  title = "Something went wrong",
  description = "Please try again. If the problem continues, refresh the page.",
  error,
  reset,
  homeHref = "/",
}: {
  title?: string;
  description?: string;
  error?: Error & { digest?: string };
  reset?: () => void;
  homeHref?: string;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-semibold tracking-widest text-primary uppercase">
        Error
      </p>
      <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {error?.digest && (
        <p className="mt-3 font-mono text-[11px] text-muted-foreground">
          Ref: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {reset && (
          <Button type="button" onClick={reset}>
            Try again
          </Button>
        )}
        <Button asChild variant="outline">
          <Link href={homeHref}>Go home</Link>
        </Button>
      </div>
    </div>
  );
}
