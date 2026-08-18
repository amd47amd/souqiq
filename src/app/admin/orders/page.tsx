import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { getAdminOrderList } from "@/lib/admin-data";
import { AdminOrdersTable } from "@/components/admin/admin-orders-table";
import { AdminPageHeader } from "@/components/admin/admin-ui";
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
      <AdminPageHeader
        title="Orders"
        description="Pack, call, and collect cash on delivery."
      />
      <AdminOrdersTable orders={orders} initialStatus={initialStatus} />
    </div>
  );
}
