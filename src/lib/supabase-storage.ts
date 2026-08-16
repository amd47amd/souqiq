import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "product-images";

function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase Storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function ensureProductImagesBucket(client: SupabaseClient) {
  const { data: buckets, error: listError } = await client.storage.listBuckets();
  if (listError) {
    throw new Error(`Could not list storage buckets: ${listError.message}`);
  }

  const exists = buckets?.some((b) => b.name === BUCKET);
  if (exists) return;

  const { error: createError } = await client.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });

  // Race / already exists
  if (createError && !/already exists|duplicate/i.test(createError.message)) {
    throw new Error(`Could not create bucket: ${createError.message}`);
  }
}

export async function uploadProductImage(file: File) {
  const client = getSupabaseAdmin();
  await ensureProductImagesBucket(client);

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || "jpg"}`;

  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await client.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function isSupabaseStorageConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
