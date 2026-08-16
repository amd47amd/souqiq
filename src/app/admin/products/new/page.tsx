import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

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
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
