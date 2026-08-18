import { requireAdmin } from "@/lib/admin";
import { getAdminCategoryOptions } from "@/lib/admin-data";
import { ProductForm } from "@/components/admin/product-form";
import { AdminPageHeader } from "@/components/admin/admin-ui";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getAdminCategoryOptions();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Add product"
        description="Photo, price, and stock for a new catalog item."
      />
      <ProductForm
        categories={categories
          .filter((category) => category.isActive)
          .map((category) => ({ id: category.id, name: category.name }))}
      />
    </div>
  );
}
