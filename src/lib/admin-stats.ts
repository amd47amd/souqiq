import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const [
    revenueAgg,
    orderCount,
    pendingCount,
    userCount,
    productCount,
    unseenOrders,
    recentOrders,
    topProductsRaw,
    ordersLast30,
    usersLast30,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { not: "CANCELED" } },
      _sum: { total: true },
    }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.user.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count({ where: { isSeenByAdmin: false } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        user: { select: { name: true, phone: true } },
        governorate: { select: { name: true } },
        _count: { select: { items: true } },
      },
    }),
    prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      _sum: { quantity: true, unitPrice: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.order.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { not: "CANCELED" },
      },
      select: { createdAt: true, total: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

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
    const key = dayKey(order.createdAt);
    revenueByDayMap.set(key, (revenueByDayMap.get(key) ?? 0) + order.total);
    ordersByDayMap.set(key, (ordersByDayMap.get(key) ?? 0) + 1);
  }

  for (const user of usersLast30) {
    const key = dayKey(user.createdAt);
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
    revenue: revenueAgg._sum.total ?? 0,
    orderCount,
    pendingCount,
    userCount,
    productCount,
    unseenOrders,
    recentOrders,
    topProducts,
    chartDays,
  };
}
