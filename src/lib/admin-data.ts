import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_CACHE_TAGS,
  ADMIN_LIST_REVALIDATE_SECONDS,
} from "@/lib/admin-cache";

export type AdminOrderListItem = {
  id: string;
  orderNumber: string;
  total: number;
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELED";
  isSeenByAdmin: boolean;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  governorateName: string;
  addressLine: string;
  notes: string | null;
  itemCount: number;
  itemPreview: string;
  itemImageUrl: string | null;
};

export const getAdminProductList = unstable_cache(
  async () => {
    const products = await prisma.product.findMany({
      orderBy: { updatedAt: "desc" },
      take: 150,
      select: {
        id: true,
        name: true,
        basePrice: true,
        hasVariants: true,
        isActive: true,
        isFeatured: true,
        isTrending: true,
        category: { select: { name: true } },
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
          select: { url: true },
        },
        variants: {
          where: { isActive: true },
          select: { stock: true },
        },
      },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      basePrice: product.basePrice,
      hasVariants: product.hasVariants,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isTrending: product.isTrending,
      categoryName: product.category.name,
      imageUrl: product.images[0]?.url ?? null,
      stock: product.variants.reduce((sum, variant) => sum + variant.stock, 0),
    }));
  },
  ["admin-product-list"],
  {
    revalidate: ADMIN_LIST_REVALIDATE_SECONDS,
    tags: [ADMIN_CACHE_TAGS.products],
  },
);

export const getAdminOrderList = unstable_cache(
  async (): Promise<AdminOrderListItem[]> => {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        isSeenByAdmin: true,
        createdAt: true,
        customerName: true,
        customerPhone: true,
        addressLine: true,
        notes: true,
        governorate: { select: { name: true } },
        _count: { select: { items: true } },
        items: {
          take: 1,
          select: {
            productName: true,
            quantity: true,
            product: {
              select: {
                images: {
                  orderBy: { sortOrder: "asc" },
                  take: 1,
                  select: { url: true },
                },
              },
            },
          },
        },
      },
    });

    return orders.map((order) => {
      const first = order.items[0];
      const extra = order._count.items - 1;
      const preview = first
        ? extra > 0
          ? `${first.productName} +${extra} more`
          : first.productName
        : "No items";

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        isSeenByAdmin: order.isSeenByAdmin,
        createdAt: order.createdAt.toISOString(),
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        governorateName: order.governorate.name,
        addressLine: order.addressLine,
        notes: order.notes,
        itemCount: order._count.items,
        itemPreview: preview,
        itemImageUrl: first?.product.images[0]?.url ?? null,
      };
    });
  },
  ["admin-order-list"],
  { revalidate: 12, tags: [ADMIN_CACHE_TAGS.orders] },
);

export const getAdminUserList = unstable_cache(
  async () =>
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 150,
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        _count: { select: { orders: true } },
      },
    }),
  ["admin-user-list"],
  {
    revalidate: ADMIN_LIST_REVALIDATE_SECONDS,
    tags: [ADMIN_CACHE_TAGS.users],
  },
);

export type AdminCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
};

export const getAdminCategoryList = unstable_cache(
  async (): Promise<AdminCategoryRow[]> => {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        sortOrder: true,
        isActive: true,
        _count: { select: { products: true } },
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
      productCount: category._count.products,
    }));
  },
  ["admin-category-list"],
  {
    revalidate: ADMIN_LIST_REVALIDATE_SECONDS,
    tags: [ADMIN_CACHE_TAGS.categories],
  },
);

export const getAdminCategoryOptions = unstable_cache(
  async () =>
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, isActive: true },
    }),
  ["admin-category-options"],
  {
    revalidate: 60,
    tags: [ADMIN_CACHE_TAGS.categories],
  },
);

export type AdminShippingRow = {
  id: string;
  name: string;
  shippingFee: number;
  isActive: boolean;
  orderCount: number;
};

export const getAdminShippingList = unstable_cache(
  async (): Promise<AdminShippingRow[]> => {
    const governorates = await prisma.governorate.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        shippingFee: true,
        isActive: true,
        _count: { select: { orders: true } },
      },
    });

    return governorates.map((governorate) => ({
      id: governorate.id,
      name: governorate.name,
      shippingFee: governorate.shippingFee,
      isActive: governorate.isActive,
      orderCount: governorate._count.orders,
    }));
  },
  ["admin-shipping-list"],
  {
    revalidate: ADMIN_LIST_REVALIDATE_SECONDS,
    tags: [ADMIN_CACHE_TAGS.shipping],
  },
);

export const getAdminOrderById = cache(async (id: string) =>
  prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, phone: true } },
      governorate: true,
      items: {
        include: {
          product: {
            select: {
              images: {
                orderBy: { sortOrder: "asc" },
                take: 1,
                select: { url: true },
              },
            },
          },
        },
      },
    },
  }),
);
