import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { getAdminCategoryList } from "@/lib/admin-data";
import { AdminCategoriesTable } from "@/components/admin/admin-categories-table";
import { AdminPageHeader } from "@/components/admin/admin-ui";

export const metadata: Metadata = {
  title: "Admin Categories",
};

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await getAdminCategoryList();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Collections shoppers see on the homepage and in the catalog."
      />
      <AdminCategoriesTable categories={categories} />
    </div>
  );
}
