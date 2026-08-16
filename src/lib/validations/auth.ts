import { z } from "zod";
import { normalizeIraqiPhone } from "@/lib/phone";

export const phoneSchema = z
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
  });

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name is too long"),
    phone: phoneSchema,
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password is too long"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
