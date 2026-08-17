"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/empty-state";
import { formatIQD } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

export function CartPageClient() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  if (!mounted) {
    return (
      <div className="h-48 animate-pulse rounded-xl bg-muted" aria-hidden />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="size-7" strokeWidth={1.75} />}
        title="Your cart is empty"
        description="Browse the catalog, add what you like, and checkout with cash on delivery."
        actionHref="/products"
        actionLabel="Continue shopping"
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.variantId}
            className="flex gap-4 rounded-[1.35rem] border border-border/80 bg-white p-4 sm:p-5"
          >
            <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-muted sm:size-28">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-display text-base font-semibold">
                    {item.name}
                  </h2>
                  {item.variantLabel && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.variantLabel}
                    </p>
                  )}
                </div>
                <p className="text-sm font-semibold text-primary">
                  {formatIQD(item.unitPrice * item.quantity)}
                </p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatIQD(item.unitPrice)} each
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-xl border border-border text-sm transition-colors hover:bg-muted"
                  onClick={() =>
                    updateQuantity(item.variantId, item.quantity - 1)
                  }
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-xl border border-border text-sm transition-colors hover:bg-muted"
                  onClick={() =>
                    updateQuantity(item.variantId, item.quantity + 1)
                  }
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <button
                  type="button"
                  className="ml-auto text-sm text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(item.variantId)}
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-[1.35rem] border border-border/80 bg-white p-6 shadow-[0_16px_40px_-32px_rgba(18,21,26,0.4)] lg:sticky lg:top-24">
        <h2 className="font-display text-lg font-semibold">Order summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatIQD(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-muted-foreground">Calculated at checkout</span>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span className="text-primary">{formatIQD(subtotal)}</span>
        </div>
        <Button asChild size="lg" className="mt-6 w-full rounded-full">
          <Link href="/checkout">Proceed to checkout</Link>
        </Button>
        <Button asChild variant="outline" className="mt-2 w-full rounded-full">
          <Link href="/products">Continue shopping</Link>
        </Button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Payment: Cash on Delivery only
        </p>
      </aside>
    </div>
  );
}
