"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { upsertProductAction } from "@/actions/admin";
import { uploadProductImageAction } from "@/actions/upload";
import { compressImageFile } from "@/lib/compress-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminPanel } from "@/components/admin/admin-ui";

type CategoryOption = { id: string; name: string };

type ProductValues = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  basePrice: number;
  compareAtPrice: number | null;
  stock: number;
  imageUrl: string;
  isFeatured: boolean;
  isTrending: boolean;
  isActive: boolean;
  hasVariants?: boolean;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ProductForm({
  categories,
  product,
}: {
  categories: CategoryOption[];
  product?: ProductValues;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugLocked, setSlugLocked] = useState(Boolean(product?.id));

  function onSubmit(formData: FormData) {
    setError(null);
    formData.set("imageUrl", imageUrl);
    formData.set("name", name);
    formData.set("slug", slug);
    startTransition(async () => {
      const result = await upsertProductAction(formData);
      if (result && "ok" in result && !result.ok) {
        setError(result.message ?? "Could not save product.");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    });
  }

  async function onFileChange(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      let toUpload = file;
      try {
        toUpload = await compressImageFile(file);
      } catch {
        toUpload = file;
      }
      const body = new FormData();
      body.set("file", toUpload);
      const result = await uploadProductImageAction(body);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setImageUrl(result.url);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <form action={onSubmit} className="space-y-5">
      {product?.id && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="imageUrl" value={imageUrl} />

      <Link
        href="/admin/products"
        className="inline-block text-sm text-muted-foreground hover:text-primary"
      >
        ← Catalog
      </Link>

      {error && (
        <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,280px)_1fr]">
        <AdminPanel className="p-4">
          <p className="text-sm font-medium">Look</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            This is the photo customers see first.
          </p>
          <div className="relative mt-4 aspect-[4/5] overflow-hidden rounded-2xl bg-[#eef1f6] ring-1 ring-border/80">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Product preview"
                fill
                sizes="280px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImagePlus className="size-7 opacity-60" />
                <span className="text-xs">No image yet</span>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => onFileChange(e.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            className="mt-4 w-full"
            disabled={uploading || pending}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <ImagePlus className="size-4" />
                Upload photo
              </>
            )}
          </Button>
          <div className="mt-3 space-y-1.5">
            <Label htmlFor="imageUrlVisible">Or paste URL</Label>
            <Input
              id="imageUrlVisible"
              type="url"
              placeholder="https://…"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </AdminPanel>

        <AdminPanel className="space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                required
                value={name}
                onChange={(event) => {
                  const next = event.target.value;
                  setName(next);
                  if (!slugLocked) setSlug(slugify(next));
                }}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="slug">URL slug</Label>
              <Input
                id="slug"
                name="slug"
                required
                value={slug}
                onChange={(event) => {
                  setSlugLocked(true);
                  setSlug(event.target.value);
                }}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                defaultValue={product?.description}
                className="flex min-h-28 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                name="categoryId"
                required
                defaultValue={product?.categoryId ?? categories[0]?.id}
                className="flex h-10 w-full rounded-xl border border-input bg-white px-3 text-sm"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min={0}
                defaultValue={product?.stock ?? 20}
                disabled={product?.hasVariants}
              />
              {product?.hasVariants ? (
                <p className="text-xs text-muted-foreground">
                  Stock is managed per variant.
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="basePrice">Price (IQD)</Label>
              <Input
                id="basePrice"
                name="basePrice"
                type="number"
                min={1}
                required
                defaultValue={product?.basePrice ?? 10000}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compareAtPrice">Compare at</Label>
              <Input
                id="compareAtPrice"
                name="compareAtPrice"
                type="number"
                min={0}
                defaultValue={product?.compareAtPrice ?? ""}
              />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <ToggleCard
              name="isActive"
              title="Live"
              hint="Visible in the shop"
              defaultChecked={product?.isActive ?? true}
            />
            <ToggleCard
              name="isFeatured"
              title="Featured"
              hint="Homepage spotlight"
              defaultChecked={product?.isFeatured}
            />
            <ToggleCard
              name="isTrending"
              title="Trending"
              hint="Trending row"
              defaultChecked={product?.isTrending}
            />
          </div>

          <div className="flex gap-2 border-t border-border/80 pt-4">
            <Button type="submit" disabled={pending || uploading}>
              {pending ? "Saving…" : product?.id ? "Save changes" : "Add product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>
          </div>
        </AdminPanel>
      </div>
    </form>
  );
}

function ToggleCard({
  name,
  title,
  hint,
  defaultChecked,
}: {
  name: string;
  title: string;
  hint: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/80 bg-[#f8f9fb] p-3 has-[:checked]:border-primary/30 has-[:checked]:bg-[#eef3ff]">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 accent-primary"
      />
      <span>
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
    </label>
  );
}
