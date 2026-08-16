"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/layout/error-fallback";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[shop error]", error);
  }, [error]);

  return (
    <ErrorFallback
      title="This page hit a snag"
      description="We could not load this storefront page. Your cart is safe — try again."
      error={error}
      reset={reset}
    />
  );
}
