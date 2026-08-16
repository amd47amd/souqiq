import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatIQD } from "@/lib/utils";
import { PageTransition } from "@/components/layout/page-transition";
import { OrderSuccessHero } from "@/components/checkout/order-success-hero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

type Props = {
  searchParams: Promise<{ order?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { order: orderNumber } = await searchParams;
  if (!orderNumber) {
    redirect("/products");
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      userId: session.user.id,
    },
    include: {
      governorate: true,
      items: true,
    },
  });

  if (!order) {
    redirect("/products");
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
        <OrderSuccessHero
          title="Order placed"
          subtitle={`Thank you, ${order.customerName}. Your COD order is confirmed.`}
        >
          <div className="mt-6 rounded-lg bg-muted/50 px-4 py-3 text-left text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Order number</span>
              <span className="font-semibold">{order.orderNumber}</span>
            </div>
            <div className="mt-2 flex justify-between gap-4">
              <span className="text-muted-foreground">Deliver to</span>
              <span className="text-right font-medium">
                {order.governorate.name}
              </span>
            </div>
            <div className="mt-2 flex justify-between gap-4">
              <span className="text-muted-foreground">Items</span>
              <span className="font-medium">{order.items.length}</span>
            </div>
            <div className="mt-2 flex justify-between gap-4">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold text-primary">
                {formatIQD(order.total)}
              </span>
            </div>
            <div className="mt-2 flex justify-between gap-4">
              <span className="text-muted-foreground">Payment</span>
              <span className="font-medium">Cash on Delivery</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/products">Continue shopping</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/account">My account</Link>
            </Button>
          </div>
        </OrderSuccessHero>
      </div>
    </PageTransition>
  );
}
