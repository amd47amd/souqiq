import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getAdminProductList } from "@/lib/admin-data";
import { AdminProductsTable } from "@/components/admin/admin-products-table";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Products",
};

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getAdminProductList();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products"
        description={`${products.length} items in the catalog`}
        action={
          <Button asChild>
            <Link href="/admin/products/new">Add product</Link>
          </Button>
        }
      />
      <AdminProductsTable products={products} />
    </div>
  );
}
