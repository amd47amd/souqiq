"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/empty-state";
import { formatIQD } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import {
  placeOrderAction,
  type PlaceOrderState,
} from "@/actions/orders";

type GovernorateOption = {
  id: string;
  name: string;
  shippingFee: number;
};

type Props = {
  userName: string;
  userPhone: string;
  governorates: GovernorateOption[];
};

const initialState: PlaceOrderState = { ok: false };

export function CheckoutForm({ userName, userPhone, governorates }: Props) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [mounted, setMounted] = useState(false);
  const [governorateId, setGovernorateId] = useState(
    governorates[0]?.id ?? "",
  );
  const [state, formAction, pending] = useActionState(
    placeOrderAction,
    initialState,
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (state.ok && state.orderNumber) {
      clearCart();
      router.push(`/checkout/success?order=${encodeURIComponent(state.orderNumber)}`);
    }
  }, [state, clearCart, router]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  );

  const shippingFee =
    governorates.find((g) => g.id === governorateId)?.shippingFee ?? 0;
  const total = subtotal + shippingFee;

  if (!mounted) {
    return (
      <div className="h-64 animate-pulse rounded-xl bg-muted" aria-hidden />
    );
  }

  if (items.length === 0 && !state.ok) {
    return (
      <EmptyState
        icon={<ShoppingBag className="size-7" strokeWidth={1.75} />}
        title="Your cart is empty"
        description="Add products before checking out with cash on delivery."
        actionHref="/products"
        actionLabel="Browse products"
      />
    );
  }

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(
          items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        )}
      />

      <div className="space-y-6 rounded-[1.35rem] border border-border/80 bg-white p-6 sm:p-8">
        <div>
          <h2 className="font-display text-xl font-semibold">
            Delivery details
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Name and phone are filled from your account — you can edit them.
          </p>
        </div>

        {state.message && !state.ok && (
          <div
            className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {state.message}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="customerName">Full name</Label>
            <Input
              id="customerName"
              name="customerName"
              defaultValue={userName}
              required
              disabled={pending}
            />
            {state.fieldErrors?.customerName?.[0] && (
              <p className="text-xs text-destructive">
                {state.fieldErrors.customerName[0]}
              </p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="customerPhone">Phone number</Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              defaultValue={userPhone}
              required
              disabled={pending}
            />
            {state.fieldErrors?.customerPhone?.[0] && (
              <p className="text-xs text-destructive">
                {state.fieldErrors.customerPhone[0]}
              </p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="governorateId">Governorate</Label>
            <select
              id="governorateId"
              name="governorateId"
              value={governorateId}
              onChange={(e) => setGovernorateId(e.target.value)}
              required
              disabled={pending}
              className="flex h-10 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              {governorates.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} — {formatIQD(g.shippingFee)} shipping
                </option>
              ))}
            </select>
            {state.fieldErrors?.governorateId?.[0] && (
              <p className="text-xs text-destructive">
                {state.fieldErrors.governorateId[0]}
              </p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="addressLine">Delivery address</Label>
            <Input
              id="addressLine"
              name="addressLine"
              placeholder="Street, district, landmark…"
              required
              disabled={pending}
            />
            {state.fieldErrors?.addressLine?.[0] && (
              <p className="text-xs text-destructive">
                {state.fieldErrors.addressLine[0]}
              </p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Order notes (optional)</Label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              disabled={pending}
              placeholder="Gate code, preferred time, etc."
              className="flex w-full rounded-xl border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-[#f7f8fb] px-4 py-4">
          <p className="text-sm font-medium">Payment method</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Cash on Delivery (COD) — pay when your order arrives.
          </p>
        </div>
      </div>

      <aside className="h-fit space-y-4 rounded-[1.35rem] border border-border/80 bg-white p-6 shadow-[0_16px_40px_-32px_rgba(18,21,26,0.4)] lg:sticky lg:top-24">
        <h2 className="font-display text-lg font-semibold">Order summary</h2>

        <ul className="max-h-64 space-y-3 overflow-y-auto">
          {items.map((item) => (
            <li key={item.variantId} className="flex gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-muted">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                {item.variantLabel && (
                  <p className="truncate text-xs text-muted-foreground">
                    {item.variantLabel}
                  </p>
                )}
                <p className="mt-0.5 text-xs text-muted-foreground">
                  ×{item.quantity} · {formatIQD(item.unitPrice * item.quantity)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatIQD(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{formatIQD(shippingFee)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span className="text-primary">{formatIQD(total)}</span>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full rounded-full" disabled={pending}>
          {pending ? "Placing order…" : "Place order · COD"}
        </Button>
        <Button asChild variant="outline" className="w-full rounded-full">
          <Link href="/cart">Back to cart</Link>
        </Button>
      </aside>
    </form>
  );
}
