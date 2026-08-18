import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getAdminOrderById } from "@/lib/admin-data";
import { formatIQD } from "@/lib/utils";
import { formatAdminDate, whatsappHref } from "@/lib/admin-format";
import { ORDER_STATUSES } from "@/types";
import { updateOrderStatusAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import {
  AdminPageHeader,
  AdminPanel,
  OrderStatusBadge,
} from "@/components/admin/admin-ui";

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

  const wa = whatsappHref(order.customerPhone);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            ← Orders
          </Link>
          <AdminPageHeader
            title={order.orderNumber}
            description={`Placed ${formatAdminDate(order.createdAt)} · Cash on delivery`}
          />
          <div className="mt-3">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        <form
          action={updateOrderStatusAction}
          className="flex items-end gap-2 rounded-2xl border border-border/80 bg-white p-3 shadow-[0_1px_2px_rgb(16_24_40_/_0.04)]"
        >
          <input type="hidden" name="orderId" value={order.id} />
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Move to
            </label>
            <select
              name="status"
              defaultValue={order.status}
              className="h-10 rounded-lg border border-input bg-white px-3 text-sm"
            >
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status === "PENDING"
                    ? "Pending"
                    : status === "SHIPPED"
                      ? "Shipped"
                      : status === "DELIVERED"
                        ? "Delivered"
                        : "Canceled"}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit">Update</Button>
        </form>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <AdminPanel className="p-5 lg:col-span-2">
          <h2 className="font-display text-base font-semibold">Items</h2>
          <ul className="mt-4 divide-y divide-border/80">
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
                <p className="font-semibold tabular-nums">
                  {formatIQD(item.unitPrice * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-border/80 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums">{formatIQD(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="tabular-nums">{formatIQD(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span className="tabular-nums text-primary">{formatIQD(order.total)}</span>
            </div>
          </div>
        </AdminPanel>

        <div className="space-y-4">
          <AdminPanel className="p-5">
            <h2 className="font-display text-base font-semibold">Customer</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Name</dt>
                <dd className="font-medium">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Phone</dt>
                <dd className="font-medium">
                  {wa ? (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      {order.customerPhone} · WhatsApp
                    </a>
                  ) : (
                    order.customerPhone
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Account</dt>
                <dd className="font-medium">
                  {order.user.name} · {order.user.phone}
                </dd>
              </div>
            </dl>
          </AdminPanel>

          <AdminPanel className="p-5">
            <h2 className="font-display text-base font-semibold">Delivery</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Governorate</dt>
                <dd className="font-medium">{order.governorate.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Address</dt>
                <dd className="font-medium">{order.addressLine}</dd>
              </div>
              {order.notes && (
                <div>
                  <dt className="text-xs text-muted-foreground">Notes</dt>
                  <dd className="font-medium">{order.notes}</dd>
                </div>
              )}
            </dl>
          </AdminPanel>
        </div>
      </div>
    </div>
  );
}
