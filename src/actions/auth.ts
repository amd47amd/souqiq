"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

export type AuthActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function registerAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, phone, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    return {
      ok: false,
      message: "An account with this phone number already exists.",
      fieldErrors: { phone: ["Phone number already registered"] },
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      phone,
      passwordHash,
      role: "USER",
    },
  });

  try {
    await signIn("credentials", {
      phone,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        ok: false,
        message: "Account created, but sign-in failed. Please log in.",
      };
    }
    throw error;
  }

  return { ok: true };
}

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = {
    phone: String(formData.get("phone") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const callbackUrl = String(formData.get("callbackUrl") || "/");

  try {
    await signIn("credentials", {
      phone: parsed.data.phone,
      password: parsed.data.password,
      redirectTo: callbackUrl.startsWith("/") ? callbackUrl : "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        ok: false,
        message: "Invalid phone number or password.",
      };
    }
    throw error;
  }

  return { ok: true };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
