"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/layout/error-fallback";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin error]", error);
  }, [error]);

  return (
    <ErrorFallback
      title="Admin panel error"
      description="Something went wrong while loading this admin view."
      error={error}
      reset={reset}
      homeHref="/admin"
    />
  );
}
