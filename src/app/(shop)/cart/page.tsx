import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { PageIntro } from "@/components/layout/page-intro";
import { CartPageClient } from "@/components/cart/cart-page-client";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Bag"
          title="Your cart"
          description="Review items before checkout. Shipping is calculated by governorate."
        />
        <CartPageClient />
      </div>
    </PageTransition>
  );
}
