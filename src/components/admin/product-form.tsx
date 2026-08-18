"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Loader2,
  Plus,
  Star,
  X,
} from "lucide-react";
import { upsertProductAction } from "@/actions/admin";
import { uploadProductImageAction } from "@/actions/upload";
import { compressImageFile } from "@/lib/compress-image";
import type { ProductSpec } from "@/lib/product-details";
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
  shortDescription: string;
  highlights: string[];
  specs: ProductSpec[];
  categoryId: string;
  basePrice: number;
  compareAtPrice: number | null;
  stock: number;
  images: string[];
  isFeatured: boolean;
  isTrending: boolean;
  isActive: boolean;
  hasVariants?: boolean;
};

const MAX_IMAGES = 12;
const SPEC_PRESETS = [
  "Brand",
  "Volume",
  "Size",
  "Color",
  "Material",
  "Origin",
  "Weight",
  "Warranty",
];

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
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [pasteUrl, setPasteUrl] = useState("");
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugLocked, setSlugLocked] = useState(Boolean(product?.id));
  const [highlights, setHighlights] = useState<string[]>(
    product?.highlights?.length ? product.highlights : [""],
  );
  const [specs, setSpecs] = useState<ProductSpec[]>(
    product?.specs?.length ? product.specs : [],
  );

  const cover = images[previewIndex] ?? images[0] ?? "";

  function onSubmit(formData: FormData) {
    setError(null);
    formData.set("imageUrls", JSON.stringify(images.filter(Boolean)));
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set(
      "highlights",
      JSON.stringify(highlights.map((item) => item.trim()).filter(Boolean)),
    );
    formData.set(
      "specs",
      JSON.stringify(
        specs
          .map((row) => ({
            label: row.label.trim(),
            value: row.value.trim(),
          }))
          .filter((row) => row.label && row.value),
      ),
    );
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

  function addImage(url: string) {
    const next = url.trim();
    if (!next) return;
    setImages((prev) => {
      const existing = prev.indexOf(next);
      if (existing >= 0) {
        setPreviewIndex(existing);
        return prev;
      }
      if (prev.length >= MAX_IMAGES) {
        setError(`You can add up to ${MAX_IMAGES} photos.`);
        return prev;
      }
      setPreviewIndex(prev.length);
      return [...prev, next];
    });
  }

  async function onFileChange(fileList: FileList | null) {
    const incoming = Array.from(fileList ?? []);
    if (incoming.length === 0) return;
    if (images.length >= MAX_IMAGES) {
      setError(`You can add up to ${MAX_IMAGES} photos.`);
      return;
    }

    setError(null);
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of incoming) {
        if (images.length + uploaded.length >= MAX_IMAGES) break;
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
          break;
        }
        uploaded.push(result.url);
      }
      if (uploaded.length) {
        setImages((prev) => {
          const next = [...prev];
          for (const url of uploaded) {
            if (!next.includes(url) && next.length < MAX_IMAGES) next.push(url);
          }
          setPreviewIndex(Math.max(0, next.length - 1));
          return next;
        });
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewIndex((current) => {
      if (index < current) return current - 1;
      if (index === current) return Math.max(0, current - 1);
      return current;
    });
  }

  function moveImage(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= images.length) return;
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next;
    });
    setPreviewIndex(nextIndex);
  }

  function makeCover(index: number) {
    if (index === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return next;
    });
    setPreviewIndex(0);
  }

  function addPastedUrl() {
    addImage(pasteUrl);
    setPasteUrl("");
  }

  return (
    <form action={onSubmit} className="space-y-5">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

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

      <div className="grid gap-5 lg:grid-cols-[minmax(0,300px)_1fr]">
        <AdminPanel className="p-4">
          <p className="text-sm font-medium">Photos</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            First photo is the cover. Add more for the shop gallery.
          </p>
          <div className="relative mt-4 aspect-[4/5] overflow-hidden rounded-2xl bg-[#eef1f6] ring-1 ring-border/80">
            {cover ? (
              <Image
                src={cover}
                alt="Product preview"
                fill
                sizes="300px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImagePlus className="size-7 opacity-60" />
                <span className="text-xs">No photos yet</span>
              </div>
            )}
            {images.length > 0 ? (
              <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white">
                {previewIndex === 0 ? "Cover" : `${previewIndex + 1} / ${images.length}`}
              </span>
            ) : null}
          </div>

          {images.length > 0 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((url, index) => (
                <div key={`${url}-${index}`} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewIndex(index)}
                    className={`relative size-14 overflow-hidden rounded-xl ring-2 ${
                      index === previewIndex
                        ? "ring-primary"
                        : "ring-transparent hover:ring-border"
                    }`}
                    aria-label={index === 0 ? "Cover photo" : `Photo ${index + 1}`}
                  >
                    <Image src={url} alt="" fill sizes="56px" className="object-cover" />
                    {index === 0 ? (
                      <span className="absolute inset-x-0 bottom-0 bg-black/55 py-0.5 text-center text-[9px] font-semibold text-white">
                        Cover
                      </span>
                    ) : null}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-white text-muted-foreground shadow ring-1 ring-border hover:text-destructive"
                    aria-label="Remove photo"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {images.length > 1 ? (
            <div className="mt-2 flex flex-wrap gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={previewIndex === 0}
                onClick={() => moveImage(previewIndex, -1)}
              >
                <ChevronLeft className="size-4" />
                Move
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={previewIndex === images.length - 1}
                onClick={() => moveImage(previewIndex, 1)}
              >
                Move
                <ChevronRight className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={previewIndex === 0}
                onClick={() => makeCover(previewIndex)}
              >
                <Star className="size-4" />
                Make cover
              </Button>
            </div>
          ) : null}

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => onFileChange(e.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            className="mt-4 w-full"
            disabled={uploading || pending || images.length >= MAX_IMAGES}
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
                {images.length ? "Add photos" : "Upload photos"}
              </>
            )}
          </Button>
          <div className="mt-3 space-y-1.5">
            <Label htmlFor="pasteUrl">Or paste a URL</Label>
            <div className="flex gap-2">
              <Input
                id="pasteUrl"
                type="url"
                placeholder="https://…"
                value={pasteUrl}
                onChange={(e) => setPasteUrl(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addPastedUrl();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                disabled={!pasteUrl.trim() || images.length >= MAX_IMAGES}
                onClick={addPastedUrl}
              >
                Add
              </Button>
            </div>
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
              <Label htmlFor="shortDescription">Short pitch</Label>
              <Input
                id="shortDescription"
                name="shortDescription"
                maxLength={160}
                placeholder="One line under the name, e.g. Clean citrus for everyday wear"
                defaultValue={product?.shortDescription ?? ""}
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
            <div className="space-y-2 sm:col-span-2">
              <Label>Highlights</Label>
              <p className="text-xs text-muted-foreground">
                Short bullets shoppers scan first — scent, fabric, what’s in the box.
              </p>
              <div className="space-y-2">
                {highlights.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item}
                      placeholder={`Highlight ${index + 1}`}
                      onChange={(event) =>
                        setHighlights((prev) =>
                          prev.map((row, i) =>
                            i === index ? event.target.value : row,
                          ),
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() =>
                        setHighlights((prev) =>
                          prev.length === 1 ? [""] : prev.filter((_, i) => i !== index),
                        )
                      }
                      aria-label="Remove highlight"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {highlights.length < 10 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setHighlights((prev) => [...prev, ""])}
                >
                  <Plus className="size-4" />
                  Add highlight
                </Button>
              ) : null}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Details</Label>
              <p className="text-xs text-muted-foreground">
                Facts on the product page — brand, volume, material, origin.
              </p>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {SPEC_PRESETS.filter(
                  (label) => !specs.some((row) => row.label === label),
                ).map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="rounded-full border border-border bg-white px-2.5 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    onClick={() =>
                      setSpecs((prev) => [...prev, { label, value: "" }])
                    }
                  >
                    + {label}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {specs.map((row, index) => (
                  <div key={index} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_auto] gap-2">
                    <Input
                      placeholder="Label"
                      value={row.label}
                      onChange={(event) =>
                        setSpecs((prev) =>
                          prev.map((item, i) =>
                            i === index
                              ? { ...item, label: event.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                    <Input
                      placeholder="Value"
                      value={row.value}
                      onChange={(event) =>
                        setSpecs((prev) =>
                          prev.map((item, i) =>
                            i === index
                              ? { ...item, value: event.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setSpecs((prev) => prev.filter((_, i) => i !== index))
                      }
                      aria-label="Remove detail"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {specs.length < 16 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() =>
                    setSpecs((prev) => [...prev, { label: "", value: "" }])
                  }
                >
                  <Plus className="size-4" />
                  Add detail
                </Button>
              ) : null}
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
