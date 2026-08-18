"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  FolderTree,
  ImagePlus,
  Loader2,
  Search,
  X,
} from "lucide-react";
import {
  moveCategoryAction,
  toggleCategoryActiveAction,
  upsertCategoryAction,
} from "@/actions/admin";
import { uploadProductImageAction } from "@/actions/upload";
import { compressImageFile } from "@/lib/compress-image";
import type { AdminCategoryRow } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminPanel, Pill } from "@/components/admin/admin-ui";

type Filter = "all" | "live" | "hidden" | "photo" | "empty";

const FILTER_CARDS: {
  id: Exclude<Filter, "all">;
  label: string;
  hint: string;
  accent: string;
}[] = [
  { id: "live", label: "Live", hint: "On the storefront", accent: "bg-emerald-400" },
  { id: "hidden", label: "Hidden", hint: "Not shown in shop", accent: "bg-slate-400" },
  { id: "photo", label: "Cover", hint: "Has a collection photo", accent: "bg-primary" },
  { id: "empty", label: "Empty", hint: "No products yet", accent: "bg-amber-400" },
];

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function thumbSrc(src: string) {
  try {
    const url = new URL(src);
    if (
      url.hostname === "images.unsplash.com" ||
      url.hostname === "plus.unsplash.com"
    ) {
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      url.searchParams.set("w", "240");
      url.searchParams.set("q", "60");
      return url.toString();
    }
  } catch {
    // keep original
  }
  return src;
}

function matchesFilter(category: AdminCategoryRow, filter: Filter) {
  switch (filter) {
    case "live":
      return category.isActive;
    case "hidden":
      return !category.isActive;
    case "photo":
      return Boolean(category.imageUrl);
    case "empty":
      return category.productCount === 0;
    default:
      return true;
  }
}

export function AdminCategoriesTable({
  categories,
}: {
  categories: AdminCategoryRow[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  const counts = useMemo(
    () => ({
      live: categories.filter((item) => item.isActive).length,
      hidden: categories.filter((item) => !item.isActive).length,
      photo: categories.filter((item) => item.imageUrl).length,
      empty: categories.filter((item) => item.productCount === 0).length,
    }),
    [categories],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.filter((category) => {
      if (!matchesFilter(category, filter)) return false;
      if (!q) return true;
      return (
        category.name.toLowerCase().includes(q) ||
        category.slug.toLowerCase().includes(q)
      );
    });
  }, [categories, filter, query]);

  function selectFilter(next: Exclude<Filter, "all">) {
    setFilter((current) => (current === next ? "all" : next));
  }

  const activeCard = FILTER_CARDS.find((item) => item.id === filter);
  const listTitle = activeCard ? `${activeCard.label} collections` : "Collections";
  const nextSortOrder =
    categories.reduce((max, item) => Math.max(max, item.sortOrder), -1) + 1;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {FILTER_CARDS.map((item) => {
          const selected = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectFilter(item.id)}
              className={`rounded-2xl border bg-white p-4 text-left shadow-[0_1px_2px_rgb(16_24_40_/_0.04)] transition-colors ${
                selected
                  ? "border-primary/40 ring-2 ring-primary/15"
                  : "border-border/80 hover:border-primary/25"
              }`}
            >
              <span className={`mb-3 block h-1 w-8 rounded-full ${item.accent}`} />
              <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                {item.label}
              </p>
              <p className="mt-1 font-display text-2xl font-semibold">
                {counts[item.id]}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
            </button>
          );
        })}
      </div>

      <AdminPanel>
        <div className="flex flex-col gap-3 border-b border-border/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <p className="font-display text-base font-semibold">{listTitle}</p>
            <p className="text-sm text-muted-foreground">
              {visible.length} {visible.length === 1 ? "collection" : "collections"}
              {filter !== "all" ? (
                <>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className="font-medium text-primary hover:underline"
                  >
                    Show all
                  </button>
                </>
              ) : null}
            </p>
          </div>
          <div className="flex w-full gap-2 sm:max-w-md">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name or slug…"
                className="h-10 w-full rounded-xl border border-input bg-[#f8f9fb] pr-3 pl-9 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <Button
              type="button"
              onClick={() => setEditingId("new")}
              disabled={editingId === "new"}
            >
              Add
            </Button>
          </div>
        </div>

        {editingId === "new" ? (
          <CategoryEditor
            sortOrder={nextSortOrder}
            onCancel={() => setEditingId(null)}
            onSaved={() => {
              setEditingId(null);
              router.refresh();
            }}
          />
        ) : null}

        {visible.length === 0 && editingId !== "new" ? (
          <div className="px-6 py-16 text-center">
            <FolderTree className="mx-auto size-8 text-muted-foreground/70" />
            <p className="mt-3 font-display text-lg font-semibold">
              No collections here
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {query
                ? "Try a different name or slug."
                : "Add a category to group products on the storefront."}
            </p>
          </div>
        ) : (
          <ul>
            {visible.map((category) => {
              const isFirst = categories[0]?.id === category.id;
              const isLast = categories[categories.length - 1]?.id === category.id;
              if (editingId === category.id) {
                return (
                  <li key={category.id} className="border-b border-border/70 last:border-0">
                    <CategoryEditor
                      category={category}
                      onCancel={() => setEditingId(null)}
                      onSaved={() => {
                        setEditingId(null);
                        router.refresh();
                      }}
                    />
                  </li>
                );
              }

              return (
                <li
                  key={category.id}
                  className="border-b border-border/70 last:border-0"
                >
                  <article
                    role="button"
                    tabIndex={0}
                    onClick={() => setEditingId(category.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setEditingId(category.id);
                      }
                    }}
                    className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-[#fafbff] sm:gap-4 sm:px-5"
                  >
                    <CoverThumb imageUrl={category.imageUrl} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">{category.name}</p>
                        <Pill tone={category.isActive ? "success" : "muted"}>
                          {category.isActive ? "Live" : "Hidden"}
                        </Pill>
                        {!category.imageUrl ? (
                          <Pill tone="warning">No photo</Pill>
                        ) : null}
                      </div>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        /{category.slug}
                        {category.description ? ` · ${category.description}` : ""}
                      </p>
                    </div>
                    <div className="hidden shrink-0 text-right sm:block">
                      <p className="font-display font-semibold tabular-nums">
                        {category.productCount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {category.productCount === 1 ? "product" : "products"}
                      </p>
                    </div>
                    <div
                      className="flex shrink-0"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <form action={moveCategoryAction}>
                        <input type="hidden" name="id" value={category.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button
                          type="submit"
                          disabled={isFirst}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                          aria-label="Move up"
                        >
                          <ChevronUp className="size-4" />
                        </button>
                      </form>
                      <form action={moveCategoryAction}>
                        <input type="hidden" name="id" value={category.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button
                          type="submit"
                          disabled={isLast}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                          aria-label="Move down"
                        >
                          <ChevronDown className="size-4" />
                        </button>
                      </form>
                      <form action={toggleCategoryActiveAction}>
                        <input
                          type="hidden"
                          name="categoryId"
                          value={category.id}
                        />
                        <input
                          type="hidden"
                          name="isActive"
                          value={String(category.isActive)}
                        />
                        <button
                          type="submit"
                          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label={category.isActive ? "Hide" : "Show"}
                        >
                          {category.isActive ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </form>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </AdminPanel>
    </div>
  );
}

function CoverThumb({ imageUrl }: { imageUrl: string | null }) {
  return (
    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#eef1f6] ring-1 ring-border/60 sm:size-16">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbSrc(imageUrl)}
          alt=""
          className="size-full object-cover"
        />
      ) : (
        <FolderTree className="absolute inset-0 m-auto size-5 text-muted-foreground" />
      )}
    </div>
  );
}

function CategoryEditor({
  category,
  sortOrder,
  onCancel,
  onSaved,
}: {
  category?: AdminCategoryRow;
  sortOrder?: number;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(category?.imageUrl ?? "");
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugLocked, setSlugLocked] = useState(Boolean(category?.id));
  const [pasteUrl, setPasteUrl] = useState("");

  function onSubmit(formData: FormData) {
    setError(null);
    formData.set("imageUrl", imageUrl);
    formData.set("name", name);
    formData.set("slug", slug);
    startTransition(async () => {
      const result = await upsertCategoryAction(formData);
      if (result && "ok" in result && !result.ok) {
        setError(result.message ?? "Could not save category.");
        return;
      }
      onSaved();
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

  function addPastedUrl() {
    const next = pasteUrl.trim();
    if (!next) return;
    setImageUrl(next);
    setPasteUrl("");
  }

  return (
    <form action={onSubmit} className="border-b border-border/70 bg-[#fafbff] px-4 py-4 last:border-0 sm:px-5">
      {category?.id ? <input type="hidden" name="id" value={category.id} /> : null}
      <input
        type="hidden"
        name="sortOrder"
        value={category?.sortOrder ?? sortOrder ?? 0}
      />
      <p className="font-display text-base font-semibold">
        {category ? "Edit collection" : "New collection"}
      </p>
      <p className="mt-0.5 text-sm text-muted-foreground">
        Cover photo, name, and a short line for the shop.
      </p>

      {error ? (
        <p className="mt-3 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,220px)_1fr]">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#eef1f6] ring-1 ring-border/80">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImagePlus className="size-6 opacity-60" />
                <span className="text-xs">Homepage tile</span>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(event) => onFileChange(event.target.files)}
          />
          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
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
                  Photo
                </>
              )}
            </Button>
            {imageUrl ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setImageUrl("")}
                aria-label="Remove photo"
              >
                <X className="size-4" />
              </Button>
            ) : null}
          </div>
          <div className="mt-2 flex gap-2">
            <Input
              type="url"
              placeholder="Or paste URL"
              value={pasteUrl}
              onChange={(event) => setPasteUrl(event.target.value)}
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
              disabled={!pasteUrl.trim()}
              onClick={addPastedUrl}
            >
              Add
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
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
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="category-slug">URL slug</Label>
            <Input
              id="category-slug"
              name="slug"
              required
              value={slug}
              onChange={(event) => {
                setSlugLocked(true);
                setSlug(event.target.value);
              }}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="category-description">Description</Label>
            <textarea
              id="category-description"
              name="description"
              rows={3}
              defaultValue={category?.description ?? ""}
              placeholder="Shown on the collection page"
              className="flex min-h-20 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            />
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/80 bg-white p-3 has-[:checked]:border-primary/30 has-[:checked]:bg-[#eef3ff] sm:col-span-2">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={category?.isActive ?? true}
              className="mt-0.5 size-4 accent-primary"
            />
            <span>
              <span className="block text-sm font-medium">Live</span>
              <span className="block text-xs text-muted-foreground">
                Visible in the shop collections
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button type="submit" disabled={pending || uploading}>
          {pending ? "Saving…" : category ? "Save changes" : "Add collection"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
