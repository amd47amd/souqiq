import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getAdminOrderById } from "@/lib/admin-data";
import { formatIQD } from "@/lib/utils";
import { ORDER_STATUSES } from "@/types";
import { updateOrderStatusAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  return { title: order ? `Order ${order.orderNumber}` : "Order" };
}

export default async function AdminOrderDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const order = await getAdminOrderById(id);

  if (!order) notFound();

  if (!order.isSeenByAdmin) {
    await prisma.order.update({
      where: { id: order.id },
      data: { isSeenByAdmin: true },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/orders"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            ← Orders
          </Link>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {order.createdAt.toLocaleString("en-GB")} · {order.paymentMethod}
          </p>
        </div>

        <form action={updateOrderStatusAction} className="flex items-end gap-2">
          <input type="hidden" name="orderId" value={order.id} />
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Update status
            </label>
            <select
              name="status"
              defaultValue={order.status}
              className="h-10 rounded-lg border border-input bg-white px-3 text-sm"
            >
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit">Save</Button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Items</h2>
          <ul className="mt-4 divide-y divide-border">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{item.productName}</p>
                  {item.variantLabel && (
                    <p className="text-xs text-muted-foreground">
                      {item.variantLabel}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Qty {item.quantity} · {formatIQD(item.unitPrice)} each
                  </p>
                </div>
                <p className="font-semibold">
                  {formatIQD(item.unitPrice * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatIQD(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatIQD(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span className="text-primary">{formatIQD(order.total)}</span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold">Customer</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-medium">{order.customerPhone}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Account</dt>
                <dd className="font-medium">
                  {order.user.name} ({order.user.phone})
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold">Shipping</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Governorate</dt>
                <dd className="font-medium">{order.governorate.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Address</dt>
                <dd className="font-medium">{order.addressLine}</dd>
              </div>
              {order.notes && (
                <div>
                  <dt className="text-muted-foreground">Notes</dt>
                  <dd className="font-medium">{order.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
}
