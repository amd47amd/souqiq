import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveGovernorates } from "@/lib/orders";
import { PageTransition } from "@/components/layout/page-transition";
import { PageIntro } from "@/components/layout/page-intro";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  const governorates = await getActiveGovernorates();

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Cash on delivery"
          title="Checkout"
          description="Confirm your details — pay when the package arrives."
        />

        <CheckoutForm
          userName={session.user.name}
          userPhone={session.user.phone}
          governorates={governorates}
        />
      </div>
    </PageTransition>
  );
}
