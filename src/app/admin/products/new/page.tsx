import { requireAdmin } from "@/lib/admin";
import { getAdminCategoryOptions } from "@/lib/admin-data";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getAdminCategoryOptions();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Add product
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Creates a simple product with one default SKU. Variant-heavy edits can
          be refined later.
        </p>
      </div>
      <ProductForm
        categories={categories
          .filter((category) => category.isActive)
          .map((category) => ({ id: category.id, name: category.name }))}
      />
    </div>
  );
}
