"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkoutSchema } from "@/lib/validations/checkout";
import { generateOrderNumber } from "@/lib/orders";
import { buildVariantLabel } from "@/lib/product-utils";
import { sendAdminNewOrderEmail } from "@/lib/email";
import { ADMIN_CACHE_TAGS } from "@/lib/admin-cache";

export type PlaceOrderState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  orderNumber?: string;
};

export async function placeOrderAction(
  _prev: PlaceOrderState,
  formData: FormData,
): Promise<PlaceOrderState> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Please sign in to complete checkout." };
  }

  let items: { productId: string; variantId: string; quantity: number }[] = [];
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]")) as typeof items;
  } catch {
    return { ok: false, message: "Invalid cart data. Please try again." };
  }

  const raw = {
    customerName: String(formData.get("customerName") ?? ""),
    customerPhone: String(formData.get("customerPhone") ?? ""),
    governorateId: String(formData.get("governorateId") ?? ""),
    addressLine: String(formData.get("addressLine") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    items,
  };

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;

  const governorate = await prisma.governorate.findFirst({
    where: { id: data.governorateId, isActive: true },
  });
  if (!governorate) {
    return {
      ok: false,
      message: "Selected governorate is unavailable.",
      fieldErrors: { governorateId: ["Please select a valid governorate"] },
    };
  }

  const variantIds = data.items.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: {
      id: { in: variantIds },
      isActive: true,
      product: { isActive: true },
    },
    include: {
      product: { select: { id: true, name: true, isActive: true } },
      optionValues: {
        include: {
          optionValue: {
            include: { option: true },
          },
        },
      },
    },
  });

  if (variants.length !== data.items.length) {
    return {
      ok: false,
      message: "Some cart items are no longer available. Please update your cart.",
    };
  }

  const variantMap = new Map(variants.map((v) => [v.id, v]));
  const lineItems: {
    productId: string;
    variantId: string;
    productName: string;
    variantLabel: string | null;
    unitPrice: number;
    quantity: number;
  }[] = [];

  let subtotal = 0;

  for (const item of data.items) {
    const variant = variantMap.get(item.variantId);
    if (!variant || variant.productId !== item.productId) {
      return {
        ok: false,
        message: "Cart items are out of sync. Please refresh and try again.",
      };
    }
    if (variant.stock < item.quantity) {
      return {
        ok: false,
        message: `Not enough stock for “${variant.product.name}”. Available: ${variant.stock}.`,
      };
    }

    const unitPrice = variant.price;
    subtotal += unitPrice * item.quantity;
    lineItems.push({
      productId: variant.productId,
      variantId: variant.id,
      productName: variant.product.name,
      variantLabel: buildVariantLabel(variant) ?? null,
      unitPrice,
      quantity: item.quantity,
    });
  }

  const shippingFee = governorate.shippingFee;
  const total = subtotal + shippingFee;

  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const item of lineItems) {
        const updated = await tx.productVariant.updateMany({
          where: {
            id: item.variantId,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });
        if (updated.count !== 1) {
          throw new Error(`STOCK_${item.productName}`);
        }
      }

      let orderNumber = generateOrderNumber();
      for (let attempt = 0; attempt < 5; attempt++) {
        const existing = await tx.order.findUnique({
          where: { orderNumber },
          select: { id: true },
        });
        if (!existing) break;
        orderNumber = generateOrderNumber();
      }

      return tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          status: "PENDING",
          paymentMethod: "COD",
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          governorateId: governorate.id,
          addressLine: data.addressLine,
          notes: data.notes || null,
          subtotal,
          shippingFee,
          total,
          isSeenByAdmin: false,
          items: {
            create: lineItems,
          },
        },
        include: {
          items: true,
          governorate: { select: { name: true } },
        },
      });
    });

    // Fire-and-forget — never block or fail checkout on email issues
    void sendAdminNewOrderEmail({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      addressLine: order.addressLine,
      notes: order.notes,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      total: order.total,
      paymentMethod: order.paymentMethod,
      governorateName: order.governorate.name,
      items: order.items.map((item) => ({
        productName: item.productName,
        variantLabel: item.variantLabel,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });

    revalidateTag(ADMIN_CACHE_TAGS.dashboard, "max");
    revalidateTag(ADMIN_CACHE_TAGS.orders, "max");

    return {
      ok: true,
      orderNumber: order.orderNumber,
    };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("STOCK_")) {
      const name = error.message.replace("STOCK_", "");
      return {
        ok: false,
        message: `Not enough stock for “${name}”. Please update your cart.`,
      };
    }
    console.error("placeOrderAction failed:", error);
    return {
      ok: false,
      message: "Could not place your order. Please try again.",
    };
  }
}
