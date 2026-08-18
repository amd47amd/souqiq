import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getDashboardStats } from "@/lib/admin-stats";
import { formatIQD } from "@/lib/utils";
import {
  OrdersUsersChart,
  RevenueChart,
} from "@/components/admin/dashboard-charts";
import {
  AdminPageHeader,
  AdminPanel,
  OrderStatusBadge,
} from "@/components/admin/admin-ui";

export const metadata: Metadata = {
  title: "Admin Overview",
};

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getDashboardStats();

  const cards = [
    {
      label: "Revenue",
      value: formatIQD(stats.revenue),
      hint: "Paid COD · excludes canceled",
      href: "/admin/orders",
    },
    {
      label: "Orders",
      value: String(stats.orderCount),
      hint: `${stats.pendingCount} waiting to ship`,
      href: "/admin/orders",
    },
    {
      label: "Customers",
      value: String(stats.userCount),
      hint: "Registered accounts",
      href: "/admin/users",
    },
    {
      label: "Live products",
      value: String(stats.productCount),
      hint: "Visible in the catalog",
      href: "/admin/products",
    },
  ];

  return (
    <div className="space-y-7">
      <AdminPageHeader
        title="Overview"
        description={
          stats.unseenOrders > 0
            ? `${stats.unseenOrders} new order${stats.unseenOrders === 1 ? "" : "s"} need attention`
            : "Store performance and recent COD activity"
        }
        action={
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-primary hover:underline"
          >
            Open orders
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <AdminPanel className="p-5 transition-colors hover:border-primary/25 hover:bg-[#fafbff]">
              <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                {card.label}
              </p>
              <p className="mt-2 font-display text-2xl font-semibold tracking-tight">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
            </AdminPanel>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminPanel className="p-5">
          <h2 className="font-display text-base font-semibold">Revenue</h2>
          <p className="mb-4 text-sm text-muted-foreground">Last 30 days</p>
          <RevenueChart data={stats.chartDays} />
        </AdminPanel>
        <AdminPanel className="p-5">
          <h2 className="font-display text-base font-semibold">Activity</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Orders and new customers
          </p>
          <OrdersUsersChart data={stats.chartDays} />
        </AdminPanel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminPanel className="p-5">
          <h2 className="font-display text-base font-semibold">Bestsellers</h2>
          <ul className="mt-3 divide-y divide-border/80">
            {stats.topProducts.length === 0 && (
              <li className="py-8 text-center text-sm text-muted-foreground">
                No sales yet.
              </li>
            )}
            {stats.topProducts.map((product, index) => (
              <li
                key={product.productId}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="truncate font-medium">{product.name}</span>
                </div>
                <span className="shrink-0 text-muted-foreground">
                  {product.unitsSold} sold
                </span>
              </li>
            ))}
          </ul>
        </AdminPanel>

        <AdminPanel className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-border/80">
            {stats.recentOrders.length === 0 && (
              <li className="py-8 text-center text-sm text-muted-foreground">
                No orders yet.
              </li>
            )}
            {stats.recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between gap-3 py-3 text-sm transition-colors hover:text-primary"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {order.user.name} · {order.governorate.name}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold">{formatIQD(order.total)}</p>
                    <div className="mt-1 flex justify-end">
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </AdminPanel>
      </div>
    </div>
  );
}
