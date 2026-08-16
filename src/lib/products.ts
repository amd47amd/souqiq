import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export const PRODUCTS_PER_PAGE = 12;

export type ProductSort = "newest" | "price-asc" | "price-desc" | "name";

export type ProductListParams = {
  category?: string;
  q?: string;
  sort?: ProductSort;
  page?: number;
  featured?: boolean;
  trending?: boolean;
};

const productCardInclude = {
  category: { select: { id: true, name: true, slug: true } },
  images: {
    orderBy: { sortOrder: "asc" as const },
    take: 2,
  },
  variants: {
    where: { isActive: true },
    orderBy: [{ isDefault: "desc" as const }, { price: "asc" as const }],
    take: 1,
    select: { price: true, compareAtPrice: true, stock: true },
  },
} satisfies Prisma.ProductInclude;

export type ProductCardData = Prisma.ProductGetPayload<{
  include: typeof productCardInclude;
}>;

function buildOrderBy(
  sort: ProductSort = "newest",
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { basePrice: "asc" };
    case "price-desc":
      return { basePrice: "desc" };
    case "name":
      return { name: "asc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { products: { where: { isActive: true } } },
      },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findFirst({
    where: { slug, isActive: true },
  });
}

export async function getProducts(params: ProductListParams = {}) {
  const page = Math.max(1, params.page ?? 1);
  const sort = params.sort ?? "newest";
  const skip = (page - 1) * PRODUCTS_PER_PAGE;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(params.featured ? { isFeatured: true } : {}),
    ...(params.trending ? { isTrending: true } : {}),
    ...(params.category
      ? { category: { slug: params.category, isActive: true } }
      : {}),
    ...(params.q
      ? {
          OR: [
            { name: { contains: params.q, mode: "insensitive" } },
            { description: { contains: params.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productCardInclude,
      orderBy: buildOrderBy(sort),
      skip,
      take: PRODUCTS_PER_PAGE,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    pageSize: PRODUCTS_PER_PAGE,
    totalPages: Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE)),
  };
}

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: productCardInclude,
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}

export async function getTrendingProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isTrending: true },
    include: productCardInclude,
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      options: {
        orderBy: { sortOrder: "asc" },
        include: {
          values: { orderBy: { sortOrder: "asc" } },
        },
      },
      variants: {
        where: { isActive: true },
        include: {
          optionValues: {
            include: {
              optionValue: {
                include: { option: true },
              },
            },
          },
        },
        orderBy: [{ isDefault: "desc" }, { price: "asc" }],
      },
    },
  });
}

export type ProductDetail = NonNullable<
  Awaited<ReturnType<typeof getProductBySlug>>
>;

export function getDisplayPrice(product: ProductCardData) {
  const variant = product.variants[0];
  return {
    price: variant?.price ?? product.basePrice,
    compareAtPrice: variant?.compareAtPrice ?? product.compareAtPrice,
  };
}
