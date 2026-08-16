import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatIQD } from "@/lib/utils";
import { ORDER_STATUSES } from "@/types";
import type { OrderStatus } from "@/types";

export const metadata: Metadata = {
  title: "Admin Orders",
};

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  await requireAdmin();
  const { status } = await searchParams;
  const statusFilter =
    status && ORDER_STATUSES.includes(status as OrderStatus)
      ? (status as OrderStatus)
      : undefined;

  const orders = await prisma.order.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, phone: true } },
      governorate: { select: { name: true } },
      _count: { select: { items: true } },
    },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Orders
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage COD orders and delivery status.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip href="/admin/orders" active={!statusFilter} label="All" />
        {ORDER_STATUSES.map((s) => (
          <FilterChip
            key={s}
            href={`/admin/orders?status=${s}`}
            active={statusFilter === s}
            label={s}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                Governorate
              </th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No orders found.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                  {!order.isSeenByAdmin && (
                    <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                      NEW
                    </span>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {order.createdAt.toLocaleString("en-GB")}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p>{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.customerPhone}
                  </p>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  {order.governorate.name}
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatIQD(order.total)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-white text-foreground ring-1 ring-border hover:bg-muted"
      }`}
    >
      {label}
    </Link>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    PENDING: "bg-amber-50 text-amber-800 ring-amber-200",
    SHIPPED: "bg-blue-50 text-blue-800 ring-blue-200",
    DELIVERED: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    CANCELED: "bg-red-50 text-red-800 ring-red-200",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${styles[status]}`}
    >
      {status}
    </span>
  );
}
