import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { getAdminOrderList } from "@/lib/admin-data";
import { AdminOrdersTable } from "@/components/admin/admin-orders-table";
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
  const initialStatus =
    status && ORDER_STATUSES.includes(status as OrderStatus)
      ? (status as OrderStatus)
      : undefined;

  const orders = await getAdminOrderList();

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

      <AdminOrdersTable orders={orders} initialStatus={initialStatus} />
    </div>
  );
}
