import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, Package, Phone } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getAdminOrderById } from "@/lib/admin-data";
import { formatIQD } from "@/lib/utils";
import {
  formatAdminDate,
  ORDER_STATUS_LABEL,
  orderWhatsAppText,
  whatsappHref,
} from "@/lib/admin-format";
import { ORDER_STATUSES } from "@/types";
import type { OrderStatus } from "@/types";
import { updateOrderStatusAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { AdminPanel, OrderStatusBadge } from "@/components/admin/admin-ui";
import { CopyButton } from "@/components/admin/copy-button";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  return { title: order ? `Order ${order.orderNumber}` : "Order" };
}

const PIPELINE: OrderStatus[] = ["PENDING", "SHIPPED", "DELIVERED"];

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

  const wa = whatsappHref(
    order.customerPhone,
    orderWhatsAppText(order.orderNumber, order.customerName),
  );
  const tel = `tel:${order.customerPhone}`;
  const currentStep =
    order.status === "CANCELED" ? -1 : PIPELINE.indexOf(order.status);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/orders"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← All orders
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-[1.75rem] font-semibold tracking-tight">
                {order.orderNumber}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed {formatAdminDate(order.createdAt)} · Cash on delivery
            </p>
          </div>
          <p className="font-display text-2xl font-semibold tabular-nums text-primary">
            {formatIQD(order.total)}
          </p>
        </div>
      </div>

      {order.status === "CANCELED" ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          This order was canceled. No cash should be collected.
        </div>
      ) : (
        <AdminPanel className="px-4 py-4 sm:px-6">
          <ol className="grid grid-cols-3 gap-2">
            {PIPELINE.map((step, index) => {
              const done = currentStep >= index;
              const active = currentStep === index;
              return (
                <li key={step} className="min-w-0">
                  <div
                    className={`h-1.5 rounded-full ${
                      done ? "bg-primary" : "bg-muted"
                    }`}
                  />
                  <p
                    className={`mt-2 text-xs font-medium ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {ORDER_STATUS_LABEL[step]}
                  </p>
                </li>
              );
            })}
          </ol>
        </AdminPanel>
      )}

      {order.status !== "DELIVERED" && order.status !== "CANCELED" ? (
        <div className="flex flex-wrap gap-2">
          {order.status === "PENDING" ? (
            <StatusButton orderId={order.id} status="SHIPPED" label="Mark as shipped" />
          ) : null}
          {order.status === "SHIPPED" ? (
            <StatusButton
              orderId={order.id}
              status="DELIVERED"
              label="Mark as delivered"
            />
          ) : null}
          <StatusButton
            orderId={order.id}
            status="CANCELED"
            label="Cancel order"
            tone="danger"
          />
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-3">
        <AdminPanel className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Items to pack</h2>
            <p className="text-xs text-muted-foreground">
              {order.items.reduce((sum, item) => sum + item.quantity, 0)} pieces
            </p>
          </div>
          <ul className="mt-4 divide-y divide-border/80">
            {order.items.map((item) => {
              const image = item.product.images[0]?.url;
              return (
                <li key={item.id} className="flex items-start gap-3 py-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#eef1f6]">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt="" className="size-14 object-cover" />
                    ) : (
                      <Package className="absolute inset-0 m-auto size-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.productName}</p>
                    {item.variantLabel ? (
                      <p className="text-xs text-muted-foreground">
                        {item.variantLabel}
                      </p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      Qty {item.quantity} · {formatIQD(item.unitPrice)} each
                    </p>
                  </div>
                  <p className="font-semibold tabular-nums">
                    {formatIQD(item.unitPrice * item.quantity)}
                  </p>
                </li>
              );
            })}
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
              <span>Collect on delivery</span>
              <span className="tabular-nums text-primary">
                {formatIQD(order.total)}
              </span>
            </div>
          </div>
        </AdminPanel>

        <div className="space-y-4">
          <AdminPanel className="p-5">
            <h2 className="font-display text-base font-semibold">Customer</h2>
            <p className="mt-3 font-medium">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <a href={tel}>
                  <Phone className="size-3.5" />
                  Call
                </a>
              </Button>
              {wa ? (
                <Button asChild size="sm">
                  <a href={wa} target="_blank" rel="noreferrer">
                    <MessageCircle className="size-3.5" />
                    WhatsApp
                  </a>
                </Button>
              ) : null}
              <CopyButton value={order.customerPhone} label="Copy phone" />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Account · {order.user.name} · {order.user.phone}
            </p>
          </AdminPanel>

          <AdminPanel className="p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold">Delivery</h2>
              <CopyButton
                value={`${order.customerName}\n${order.customerPhone}\n${order.governorate.name}\n${order.addressLine}`}
                label="Copy address"
              />
            </div>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Governorate</dt>
                <dd className="font-medium">{order.governorate.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Address</dt>
                <dd className="font-medium leading-relaxed">{order.addressLine}</dd>
              </div>
              {order.notes ? (
                <div className="rounded-xl bg-amber-50 px-3 py-2 text-amber-900">
                  <dt className="text-xs font-medium">Note from customer</dt>
                  <dd className="mt-0.5">{order.notes}</dd>
                </div>
              ) : null}
            </dl>
          </AdminPanel>

          <AdminPanel className="p-5">
            <h2 className="font-display text-base font-semibold">Move status</h2>
            <form action={updateOrderStatusAction} className="mt-3 flex gap-2">
              <input type="hidden" name="orderId" value={order.id} />
              <select
                name="status"
                defaultValue={order.status}
                className="h-10 flex-1 rounded-lg border border-input bg-white px-3 text-sm"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {ORDER_STATUS_LABEL[status]}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="outline">
                Save
              </Button>
            </form>
          </AdminPanel>
        </div>
      </div>
    </div>
  );
}

function StatusButton({
  orderId,
  status,
  label,
  tone = "primary",
}: {
  orderId: string;
  status: OrderStatus;
  label: string;
  tone?: "primary" | "danger";
}) {
  return (
    <form action={updateOrderStatusAction}>
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="status" value={status} />
      <Button
        type="submit"
        variant={tone === "danger" ? "outline" : "default"}
        className={tone === "danger" ? "text-destructive hover:bg-rose-50" : undefined}
      >
        {label}
      </Button>
    </form>
  );
}
