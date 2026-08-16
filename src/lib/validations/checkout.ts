import { z } from "zod";
import { normalizeIraqiPhone } from "@/lib/phone";

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  customerPhone: z
    .string()
    .min(1, "Phone number is required")
    .transform((value, ctx) => {
      const normalized = normalizeIraqiPhone(value);
      if (!normalized) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a valid Iraqi mobile (e.g. 07501234567)",
        });
        return z.NEVER;
      }
      return normalized;
    }),
  governorateId: z.string().min(1, "Select a governorate"),
  addressLine: z
    .string()
    .trim()
    .min(5, "Please enter a fuller delivery address")
    .max(250, "Address is too long"),
  notes: z
    .string()
    .trim()
    .max(500, "Notes are too long")
    .optional()
    .or(z.literal("")),
  items: z.array(checkoutItemSchema).min(1, "Your cart is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
