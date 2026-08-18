"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { ADMIN_CACHE_TAGS } from "@/lib/admin-cache";
import {
  parseImageUrls,
  parseProductSpecs,
  parseStringList,
} from "@/lib/product-details";
import type { OrderStatus, Role } from "@/types";
import { ORDER_STATUSES } from "@/types";

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;

  if (!orderId || !ORDER_STATUSES.includes(status)) {
    return;
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status, isSeenByAdmin: true },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidateTag(ADMIN_CACHE_TAGS.dashboard, "max");
  revalidateTag(ADMIN_CACHE_TAGS.orders, "max");
}

export async function markOrderSeenAction(orderId: string) {
  await requireAdmin();
  await prisma.order.update({
    where: { id: orderId },
    data: { isSeenByAdmin: true },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidateTag(ADMIN_CACHE_TAGS.dashboard, "max");
  revalidateTag(ADMIN_CACHE_TAGS.orders, "max");
}

export async function toggleProductActiveAction(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId") ?? "");
  const isActive = String(formData.get("isActive") ?? "") === "true";
  if (!productId) return;

  await prisma.product.update({
    where: { id: productId },
    data: { isActive: !isActive },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  revalidateTag("products", "max");
  revalidateTag(ADMIN_CACHE_TAGS.products, "max");
  revalidateTag(ADMIN_CACHE_TAGS.dashboard, "max");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId") ?? "");
  if (!productId) return;

  // Soft-delete by deactivating to preserve order history
  await prisma.product.update({
    where: { id: productId },
    data: { isActive: false },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  revalidateTag("products", "max");
  revalidateTag(ADMIN_CACHE_TAGS.products, "max");
  revalidateTag(ADMIN_CACHE_TAGS.dashboard, "max");
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}

function revalidateCategoryViews(slug?: string) {
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/");
  if (slug) revalidatePath(`/categories/${slug}`);
  revalidateTag("categories", "max");
  revalidateTag("products", "max");
  revalidateTag(ADMIN_CACHE_TAGS.categories, "max");
  revalidateTag(ADMIN_CACHE_TAGS.products, "max");
  revalidateTag(ADMIN_CACHE_TAGS.dashboard, "max");
}

export async function upsertCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const description = String(formData.get("description") ?? "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  const isActive = formData.get("isActive") === "on";

  if (!name || !slug) {
    return { ok: false as const, message: "Name and slug are required." };
  }

  try {
    if (id) {
      await prisma.category.update({
        where: { id },
        data: { name, slug, description, imageUrl, sortOrder, isActive },
      });
    } else {
      await prisma.category.create({
        data: { name, slug, description, imageUrl, sortOrder, isActive },
      });
    }
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false as const,
        message: "That name or slug is already used.",
      };
    }
    return { ok: false as const, message: "Could not save category." };
  }

  revalidateCategoryViews(slug);
  return { ok: true as const };
}

export async function toggleCategoryActiveAction(formData: FormData) {
  await requireAdmin();
  const categoryId = String(formData.get("categoryId") ?? "");
  const isActive = String(formData.get("isActive") ?? "") === "true";
  if (!categoryId) return;

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: { isActive: !isActive },
    select: { slug: true },
  });

  revalidateCategoryViews(category.slug);
}

export async function moveCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!id || (direction !== "up" && direction !== "down")) return;

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true },
  });
  const index = categories.findIndex((category) => category.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= categories.length) return;

  const ordered = [...categories];
  const [moved] = ordered.splice(index, 1);
  ordered.splice(swapWith, 0, moved);

  await prisma.$transaction(
    ordered.map((category, sortOrder) =>
      prisma.category.update({
        where: { id: category.id },
        data: { sortOrder },
      }),
    ),
  );

  revalidateCategoryViews();
}

export async function updateUserAction(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "") as Role;
  const isActive = formData.get("isActive") === "on";

  if (!userId || (role !== "USER" && role !== "ADMIN")) return;

  await prisma.user.update({
    where: { id: userId },
    data: { role, isActive },
  });

  revalidatePath("/admin/users");
  revalidateTag(ADMIN_CACHE_TAGS.users, "max");
  revalidateTag(ADMIN_CACHE_TAGS.dashboard, "max");
}

export async function updateGovernorateFeeAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const shippingFee = Number(formData.get("shippingFee") ?? 0);
  const isActive = formData.get("isActive") === "on";

  if (!id || Number.isNaN(shippingFee) || shippingFee < 0) return;

  await prisma.governorate.update({
    where: { id },
    data: { shippingFee: Math.round(shippingFee), isActive },
  });

  revalidatePath("/admin/shipping");
  revalidatePath("/checkout");
  revalidateTag("governorates", "max");
  revalidateTag(ADMIN_CACHE_TAGS.shipping, "max");
}

export async function upsertProductAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const basePrice = Number(formData.get("basePrice") ?? 0);
  const compareAtPriceRaw = String(formData.get("compareAtPrice") ?? "").trim();
  const compareAtPrice = compareAtPriceRaw
    ? Number(compareAtPriceRaw)
    : null;
  const stock = Number(formData.get("stock") ?? 0);
  const shortDescription =
    String(formData.get("shortDescription") ?? "").trim() || null;
  const highlights = parseJsonField(
    formData.get("highlights"),
    parseStringList,
  );
  const specs = parseJsonField(formData.get("specs"), parseProductSpecs);
  const imageUrls = parseJsonField(formData.get("imageUrls"), parseImageUrls);
  const isFeatured = formData.get("isFeatured") === "on";
  const isTrending = formData.get("isTrending") === "on";
  const isActive = formData.get("isActive") === "on";

  if (!name || !slug || !description || !categoryId || basePrice <= 0) {
    return { ok: false as const, message: "Please fill required fields." };
  }

  const priceData = {
    name,
    slug,
    description,
    shortDescription,
    highlights,
    specs,
    categoryId,
    basePrice: Math.round(basePrice),
    compareAtPrice:
      compareAtPrice && compareAtPrice > 0
        ? Math.round(compareAtPrice)
        : null,
    isFeatured,
    isTrending,
    isActive,
  };

  const imageCreates = imageUrls.map((url, sortOrder) => ({
    url,
    alt: name,
    sortOrder,
  }));

  if (id) {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...priceData,
        images: {
          deleteMany: {},
          create: imageCreates,
        },
      },
      include: { variants: { where: { isDefault: true }, take: 1 } },
    });

    const defaultVariant = product.variants[0];
    if (defaultVariant && !product.hasVariants) {
      await prisma.productVariant.update({
        where: { id: defaultVariant.id },
        data: {
          price: Math.round(basePrice),
          compareAtPrice:
            compareAtPrice && compareAtPrice > 0
              ? Math.round(compareAtPrice)
              : null,
          stock: Math.max(0, Math.round(stock)),
        },
      });
    }
  } else {
    const skuBase = slug.replace(/[^a-z0-9]+/gi, "-").toUpperCase();
    await prisma.product.create({
      data: {
        ...priceData,
        hasVariants: false,
        images: imageCreates.length ? { create: imageCreates } : undefined,
        variants: {
          create: {
            sku: `${skuBase}-DEFAULT-${Date.now().toString().slice(-4)}`,
            price: Math.round(basePrice),
            compareAtPrice:
              compareAtPrice && compareAtPrice > 0
                ? Math.round(compareAtPrice)
                : null,
            stock: Math.max(0, Math.round(stock)),
            isDefault: true,
            isActive: true,
          },
        },
      },
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/");
  revalidateTag("products", "max");
  revalidateTag("categories", "max");
  revalidateTag(ADMIN_CACHE_TAGS.products, "max");
  revalidateTag(ADMIN_CACHE_TAGS.dashboard, "max");
  return { ok: true as const };
}

function parseJsonField<T>(
  raw: FormDataEntryValue | null,
  parse: (value: unknown) => T,
): T {
  if (typeof raw !== "string" || !raw.trim()) return parse([]);
  try {
    return parse(JSON.parse(raw));
  } catch {
    return parse([]);
  }
}
