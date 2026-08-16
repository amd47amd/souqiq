"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { upsertProductAction } from "@/actions/admin";
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
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(formData: FormData) {
    setError(null);
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

  return (
    <form action={onSubmit} className="space-y-5 rounded-xl border border-border bg-white p-6 shadow-sm">
      {product?.id && <input type="hidden" name="id" value={product.id} />}
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

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://images.unsplash.com/..."
          defaultValue={product?.imageUrl}
        />
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
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
