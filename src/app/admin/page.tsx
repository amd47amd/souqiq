import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getDashboardStats } from "@/lib/admin-stats";
import { formatIQD } from "@/lib/utils";
import {
  OrdersUsersChart,
  RevenueChart,
} from "@/components/admin/dashboard-charts";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getDashboardStats();

  const cards = [
    { label: "Revenue", value: formatIQD(stats.revenue), hint: "Excludes canceled" },
    { label: "Orders", value: String(stats.orderCount), hint: `${stats.pendingCount} pending` },
    { label: "Customers", value: String(stats.userCount), hint: "Registered users" },
    { label: "Active products", value: String(stats.productCount), hint: "Live catalog" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            SouqIQ performance overview
            {stats.unseenOrders > 0
              ? ` · ${stats.unseenOrders} new order(s) unread`
              : ""}
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="text-sm font-medium text-primary hover:underline"
        >
          Manage orders →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {card.label}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Revenue (30 days)</h2>
          <p className="mb-4 text-sm text-muted-foreground">Daily paid COD totals</p>
          <RevenueChart data={stats.chartDays} />
        </section>
        <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">
            Orders & user growth
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">Last 30 days</p>
          <OrdersUsersChart data={stats.chartDays} />
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Top-selling products</h2>
          <ul className="mt-4 divide-y divide-border">
            {stats.topProducts.length === 0 && (
              <li className="py-6 text-sm text-muted-foreground">No sales yet.</li>
            )}
            {stats.topProducts.map((product, index) => (
              <li
                key={product.productId}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <span className="text-muted-foreground">
                  {product.unitsSold} sold
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {stats.recentOrders.map((order) => (
              <li key={order.id} className="py-3">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between gap-3 text-sm hover:text-primary"
                >
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.user.name} · {order.governorate.name}
                      {!order.isSeenByAdmin ? " · New" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatIQD(order.total)}</p>
                    <p className="text-xs text-muted-foreground">{order.status}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
