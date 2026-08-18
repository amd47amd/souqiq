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
};

export const getAdminProductList = unstable_cache(
  async () => {
    const products = await prisma.product.findMany({
      orderBy: { updatedAt: "desc" },
      take: 80,
      select: {
        id: true,
        name: true,
        basePrice: true,
        hasVariants: true,
        isActive: true,
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
        governorate: { select: { name: true } },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
      isSeenByAdmin: order.isSeenByAdmin,
      createdAt: order.createdAt.toISOString(),
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      governorateName: order.governorate.name,
    }));
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

export const getAdminCategoryList = unstable_cache(
  async () =>
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
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
    }),
  ["admin-category-list"],
  {
    revalidate: 60,
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

export const getAdminShippingList = unstable_cache(
  async () =>
    prisma.governorate.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        shippingFee: true,
        isActive: true,
      },
    }),
  ["admin-shipping-list"],
  {
    revalidate: 60,
    tags: [ADMIN_CACHE_TAGS.shipping],
  },
);

export const getAdminOrderById = cache(async (id: string) =>
  prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, phone: true } },
      governorate: true,
      items: true,
    },
  }),
);
