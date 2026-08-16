"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { upsertProductAction } from "@/actions/admin";
import { uploadProductImageAction } from "@/actions/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  function onSubmit(formData: FormData) {
    setError(null);
    formData.set("imageUrl", imageUrl);
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
      const body = new FormData();
      body.set("file", file);
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
    <form
      action={onSubmit}
      className="space-y-5 rounded-xl border border-border bg-white p-6 shadow-sm"
    >
      {product?.id && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="imageUrl" value={imageUrl} />

      {error && (
        <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={product?.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" required defaultValue={product?.slug} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={product?.description}
          className="flex w-full rounded-lg border border-input bg-white px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue={product?.categoryId ?? categories[0]?.id}
          className="flex h-10 w-full rounded-lg border border-input bg-white px-3 text-sm"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
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
          {product?.hasVariants && (
            <p className="text-xs text-muted-foreground">
              Variant products manage stock per SKU.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Product image</Label>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative aspect-[4/5] w-full max-w-[160px] overflow-hidden rounded-xl bg-[#eef1f6] ring-1 ring-border/80">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Product preview"
                fill
                sizes="160px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImagePlus className="size-6 opacity-60" />
                <span className="text-xs">No image</span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div>
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
                    Upload image
                  </>
                )}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                JPG, PNG, WebP, or GIF · max 5MB · stored on Supabase
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrlVisible">Or paste image URL</Label>
              <Input
                id="imageUrlVisible"
                type="url"
                placeholder="https://…"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={product?.isFeatured}
          />
          Featured
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="isTrending"
            defaultChecked={product?.isTrending}
          />
          Trending
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={product?.isActive ?? true}
          />
          Active
        </label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={pending || uploading}>
          {pending ? "Saving…" : "Save product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
