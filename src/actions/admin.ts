"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
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
  revalidateTag("products");
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
  revalidateTag("products");
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

  if (!name || !slug) return;

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

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/");
  revalidateTag("categories");
  revalidateTag("products");
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
  revalidateTag("governorates");
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
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const isFeatured = formData.get("isFeatured") === "on";
  const isTrending = formData.get("isTrending") === "on";
  const isActive = formData.get("isActive") === "on";

  if (!name || !slug || !description || !categoryId || basePrice <= 0) {
    return { ok: false as const, message: "Please fill required fields." };
  }

  if (id) {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        categoryId,
        basePrice: Math.round(basePrice),
        compareAtPrice:
          compareAtPrice && compareAtPrice > 0
            ? Math.round(compareAtPrice)
            : null,
        isFeatured,
        isTrending,
        isActive,
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

    if (imageUrl) {
      const existingImage = await prisma.productImage.findFirst({
        where: { productId: id },
        orderBy: { sortOrder: "asc" },
      });
      if (existingImage) {
        await prisma.productImage.update({
          where: { id: existingImage.id },
          data: { url: imageUrl, alt: name },
        });
      } else {
        await prisma.productImage.create({
          data: { productId: id, url: imageUrl, alt: name, sortOrder: 0 },
        });
      }
    }
  } else {
    const skuBase = slug.replace(/[^a-z0-9]+/gi, "-").toUpperCase();
    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        basePrice: Math.round(basePrice),
        compareAtPrice:
          compareAtPrice && compareAtPrice > 0
            ? Math.round(compareAtPrice)
            : null,
        isFeatured,
        isTrending,
        isActive,
        hasVariants: false,
        images: imageUrl
          ? { create: [{ url: imageUrl, alt: name, sortOrder: 0 }] }
          : undefined,
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
  revalidatePath("/");
  revalidateTag("products");
  revalidateTag("categories");
  return { ok: true as const };
}
