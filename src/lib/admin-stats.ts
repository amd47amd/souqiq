import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_CACHE_TAGS,
  ADMIN_DASHBOARD_REVALIDATE_SECONDS,
} from "@/lib/admin-cache";

function asDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value);
}

function asNumber(value: bigint | number | null | undefined) {
  if (value == null) return 0;
  return Number(value);
}

async function fetchDashboardStats() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const [countRows, recentOrders, topProductsRaw, ordersLast30, usersLast30] =
    await Promise.all([
      prisma.$queryRaw<
        {
          revenue: bigint | number;
          orderCount: number;
          pendingCount: number;
          userCount: number;
          productCount: number;
          unseenOrders: number;
        }[]
      >`
        SELECT
          (SELECT COALESCE(SUM(total), 0)::bigint FROM "Order" WHERE status <> 'CANCELED') AS revenue,
          (SELECT COUNT(*)::int FROM "Order") AS "orderCount",
          (SELECT COUNT(*)::int FROM "Order" WHERE status = 'PENDING') AS "pendingCount",
          (SELECT COUNT(*)::int FROM "User") AS "userCount",
          (SELECT COUNT(*)::int FROM "Product" WHERE "isActive" = true) AS "productCount",
          (SELECT COUNT(*)::int FROM "Order" WHERE "isSeenByAdmin" = false) AS "unseenOrders"
      `,
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          orderNumber: true,
          total: true,
          status: true,
          isSeenByAdmin: true,
          user: { select: { name: true } },
          governorate: { select: { name: true } },
        },
      }),
      prisma.orderItem.groupBy({
        by: ["productId", "productName"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      prisma.order.findMany({
        where: {
          createdAt: { gte: thirtyDaysAgo },
          status: { not: "CANCELED" },
        },
        select: { createdAt: true, total: true },
      }),
      prisma.user.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
    ]);

  const counts = countRows[0] ?? {
    revenue: 0,
    orderCount: 0,
    pendingCount: 0,
    userCount: 0,
    productCount: 0,
    unseenOrders: 0,
  };

  const dayKey = (d: Date) => d.toISOString().slice(0, 10);
  const revenueByDayMap = new Map<string, number>();
  const ordersByDayMap = new Map<string, number>();
  const usersByDayMap = new Map<string, number>();

  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(thirtyDaysAgo.getDate() + i);
    const key = dayKey(d);
    revenueByDayMap.set(key, 0);
    ordersByDayMap.set(key, 0);
    usersByDayMap.set(key, 0);
  }

  for (const order of ordersLast30) {
    const key = dayKey(asDate(order.createdAt));
    revenueByDayMap.set(key, (revenueByDayMap.get(key) ?? 0) + order.total);
    ordersByDayMap.set(key, (ordersByDayMap.get(key) ?? 0) + 1);
  }

  for (const user of usersLast30) {
    const key = dayKey(asDate(user.createdAt));
    usersByDayMap.set(key, (usersByDayMap.get(key) ?? 0) + 1);
  }

  const chartDays = Array.from(revenueByDayMap.keys()).map((date) => ({
    date,
    label: date.slice(5),
    revenue: revenueByDayMap.get(date) ?? 0,
    orders: ordersByDayMap.get(date) ?? 0,
    users: usersByDayMap.get(date) ?? 0,
  }));

  const topProducts = topProductsRaw.map((row) => ({
    productId: row.productId,
    name: row.productName,
    unitsSold: row._sum.quantity ?? 0,
  }));

  return {
    revenue: asNumber(counts.revenue),
    orderCount: asNumber(counts.orderCount),
    pendingCount: asNumber(counts.pendingCount),
    userCount: asNumber(counts.userCount),
    productCount: asNumber(counts.productCount),
    unseenOrders: asNumber(counts.unseenOrders),
    recentOrders,
    topProducts,
    chartDays,
  };
}

export const getDashboardStats = unstable_cache(
  fetchDashboardStats,
  ["admin-dashboard"],
  {
    revalidate: ADMIN_DASHBOARD_REVALIDATE_SECONDS,
    tags: [ADMIN_CACHE_TAGS.dashboard],
  },
);
