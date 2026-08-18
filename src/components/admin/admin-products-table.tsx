"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Eye, EyeOff, Package, Search } from "lucide-react";
import { formatIQD } from "@/lib/utils";
import {
  deleteProductAction,
  toggleProductActiveAction,
} from "@/actions/admin";
import { AdminPanel, Pill } from "@/components/admin/admin-ui";

export type AdminProductRow = {
  id: string;
  name: string;
  basePrice: number;
  hasVariants: boolean;
  isActive: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  categoryName: string;
  imageUrl: string | null;
  stock: number;
};

type Filter = "all" | "live" | "hidden" | "low" | "featured";

const FILTER_CARDS: {
  id: Exclude<Filter, "all">;
  label: string;
  hint: string;
  accent: string;
}[] = [
  { id: "live", label: "Live", hint: "On the storefront", accent: "bg-emerald-400" },
  { id: "hidden", label: "Hidden", hint: "Not selling", accent: "bg-slate-400" },
  { id: "low", label: "Low stock", hint: "5 or fewer left", accent: "bg-amber-400" },
  { id: "featured", label: "Featured", hint: "Homepage picks", accent: "bg-primary" },
];

function thumbSrc(src: string) {
  try {
    const url = new URL(src);
    if (
      url.hostname === "images.unsplash.com" ||
      url.hostname === "plus.unsplash.com"
    ) {
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      url.searchParams.set("w", "640");
      url.searchParams.set("q", "70");
      return url.toString();
    }
  } catch {
    // keep original
  }
  return src;
}

function matchesFilter(product: AdminProductRow, filter: Filter) {
  switch (filter) {
    case "live":
      return product.isActive;
    case "hidden":
      return !product.isActive;
    case "low":
      return product.stock <= 5;
    case "featured":
      return product.isFeatured || product.isTrending;
    default:
      return true;
  }
}

export function AdminProductsTable({ products }: { products: AdminProductRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      live: products.filter((p) => p.isActive).length,
      hidden: products.filter((p) => !p.isActive).length,
      low: products.filter((p) => p.stock <= 5).length,
      featured: products.filter((p) => p.isFeatured || p.isTrending).length,
    }),
    [products],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      if (!matchesFilter(product, filter)) return false;
      if (!q) return true;
      return (
        product.name.toLowerCase().includes(q) ||
        product.categoryName.toLowerCase().includes(q)
      );
    });
  }, [filter, products, query]);

  function selectFilter(next: Exclude<Filter, "all">) {
    setFilter((current) => (current === next ? "all" : next));
  }

  const activeCard = FILTER_CARDS.find((item) => item.id === filter);
  const listTitle = activeCard ? `${activeCard.label} products` : "Catalog";

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

      <AdminPanel className="p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-base font-semibold">{listTitle}</p>
            <p className="text-sm text-muted-foreground">
              {visible.length} {visible.length === 1 ? "item" : "items"}
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
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name or category…"
              className="h-10 w-full rounded-xl border border-input bg-[#f8f9fb] pr-3 pl-9 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Package className="mx-auto size-8 text-muted-foreground/70" />
            <p className="mt-3 font-display text-lg font-semibold">No products here</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {query
                ? "Try a different name or category."
                : "Add a product to start the catalog."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {visible.map((product) => (
              <article
                key={product.id}
                role="link"
                tabIndex={0}
                onClick={() => router.push(`/admin/products/${product.id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/admin/products/${product.id}`);
                  }
                }}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-border/80 bg-white transition-colors hover:border-primary/25"
              >
                <div className="relative aspect-[4/5] bg-[#eef1f6]">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbSrc(product.imageUrl)}
                      alt=""
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <Package className="absolute inset-0 m-auto size-7 text-muted-foreground" />
                  )}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    <Pill tone={product.isActive ? "success" : "muted"}>
                      {product.isActive ? "Live" : "Hidden"}
                    </Pill>
                    {product.stock <= 5 ? (
                      <Pill tone="warning">
                        {product.stock === 0 ? "Out" : `${product.stock} left`}
                      </Pill>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-2 p-3">
                  <div>
                    <p className="line-clamp-2 font-medium leading-snug">
                      {product.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {product.categoryName}
                      {product.hasVariants ? " · Variants" : ""}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-sm font-semibold tabular-nums">
                      {formatIQD(product.basePrice)}
                    </p>
                    <div className="flex">
                      <form
                        action={toggleProductActiveAction}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <input type="hidden" name="productId" value={product.id} />
                        <input
                          type="hidden"
                          name="isActive"
                          value={String(product.isActive)}
                        />
                        <button
                          type="submit"
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label={product.isActive ? "Hide" : "Show"}
                        >
                          {product.isActive ? (
                            <EyeOff className="size-3.5" />
                          ) : (
                            <Eye className="size-3.5" />
                          )}
                        </button>
                      </form>
                      <form
                        action={deleteProductAction}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <input type="hidden" name="productId" value={product.id} />
                        <button
                          type="submit"
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                          aria-label="Archive"
                        >
                          <Archive className="size-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </AdminPanel>
    </div>
  );
}
