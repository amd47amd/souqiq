import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getAdminCategoryOptions } from "@/lib/admin-data";
import { ProductForm } from "@/components/admin/product-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        categoryId: true,
        basePrice: true,
        compareAtPrice: true,
        isFeatured: true,
        isTrending: true,
        isActive: true,
        hasVariants: true,
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
          select: { url: true },
        },
        variants: {
          where: { isDefault: true },
          take: 1,
          select: { stock: true },
        },
      },
    }),
    getAdminCategoryOptions(),
  ]);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Edit product
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          categoryId: product.categoryId,
          basePrice: product.basePrice,
          compareAtPrice: product.compareAtPrice,
          stock: product.variants[0]?.stock ?? 0,
          imageUrl: product.images[0]?.url ?? "",
          isFeatured: product.isFeatured,
          isTrending: product.isTrending,
          isActive: product.isActive,
          hasVariants: product.hasVariants,
        }}
      />
    </div>
  );
}
