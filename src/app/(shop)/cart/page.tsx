import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { CartPageClient } from "@/components/cart/cart-page-client";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Your cart
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review items before checkout. Shipping is calculated by governorate.
          </p>
        </div>
        <CartPageClient />
      </div>
    </PageTransition>
  );
}
