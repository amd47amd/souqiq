"use server";

import { requireAdmin } from "@/lib/admin";
import {
  isSupabaseStorageConfigured,
  uploadProductImage,
} from "@/lib/supabase-storage";

export type UploadImageState =
  | { ok: true; url: string }
  | { ok: false; message: string };

export async function uploadProductImageAction(
  formData: FormData,
): Promise<UploadImageState> {
  await requireAdmin();

  if (!isSupabaseStorageConfigured()) {
    return {
      ok: false,
      message:
        "Storage is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Choose an image file to upload." };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, message: "Image must be 5MB or smaller." };
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (file.type && !allowed.includes(file.type)) {
    return { ok: false, message: "Use JPG, PNG, WebP, or GIF." };
  }

  try {
    const url = await uploadProductImage(file);
    return { ok: true, url };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed. Try again.";
    return { ok: false, message };
  }
}
