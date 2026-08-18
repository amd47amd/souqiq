import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { getAdminShippingList } from "@/lib/admin-data";
import { AdminShippingTable } from "@/components/admin/admin-shipping-table";
import { AdminPageHeader } from "@/components/admin/admin-ui";

export const metadata: Metadata = {
  title: "Admin Shipping",
};

export default async function AdminShippingPage() {
  await requireAdmin();
  const governorates = await getAdminShippingList();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Shipping"
        description="Cash-on-delivery fee for each Iraqi governorate."
      />
      <AdminShippingTable governorates={governorates} />
    </div>
  );
}
