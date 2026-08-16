"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/layout/error-fallback";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return <ErrorFallback error={error} reset={reset} />;
}
