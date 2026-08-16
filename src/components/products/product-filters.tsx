import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductSort } from "@/lib/products";

type CategoryOption = {
  slug: string;
  name: string;
  count: number;
};

type Props = {
  categories: CategoryOption[];
  currentCategory?: string;
  currentSort: ProductSort;
  currentQuery?: string;
  trending?: boolean;
  total: number;
};

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "name", label: "A–Z" },
];

function buildHref(params: {
  category?: string;
  sort?: string;
  q?: string;
  page?: number;
  trending?: boolean;
}) {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.sort && params.sort !== "newest") search.set("sort", params.sort);
  if (params.q) search.set("q", params.q);
  if (params.trending) search.set("trending", "1");
  if (params.page && params.page > 1) search.set("page", String(params.page));
  const qs = search.toString();
  return qs ? `/products?${qs}` : "/products";
}

export function ProductFilters({
  categories,
  currentCategory,
  currentSort,
  currentQuery,
  trending = false,
  total,
}: Props) {
  const hasActive =
    !!currentCategory || !!currentQuery || trending || currentSort !== "newest";

  const categoryName = categories.find((c) => c.slug === currentCategory)?.name;

  return (
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {total} product{total === 1 ? "" : "s"}
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-tight">
            Refine
          </h2>
        </div>
        {hasActive ? (
          <Link
            href="/products"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Clear all
          </Link>
        ) : null}
      </div>

      {hasActive ? (
        <div className="flex flex-wrap gap-2">
          {trending ? (
            <ActiveChip
              href={buildHref({
                category: currentCategory,
                sort: currentSort,
                q: currentQuery,
              })}
              label="Trending"
            />
          ) : null}
          {currentCategory && categoryName ? (
            <ActiveChip
              href={buildHref({
                sort: currentSort,
                q: currentQuery,
                trending,
              })}
              label={categoryName}
            />
          ) : null}
          {currentQuery ? (
            <ActiveChip
              href={buildHref({
                category: currentCategory,
                sort: currentSort,
                trending,
              })}
              label={`“${currentQuery}”`}
            />
          ) : null}
          {currentSort !== "newest" ? (
            <ActiveChip
              href={buildHref({
                category: currentCategory,
                q: currentQuery,
                trending,
              })}
              label={
                SORT_OPTIONS.find((o) => o.value === currentSort)?.label ??
                currentSort
              }
            />
          ) : null}
        </div>
      ) : null}

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Category</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
          <FilterChip
            href={buildHref({
              sort: currentSort,
              q: currentQuery,
              trending,
            })}
            active={!currentCategory}
            label="All"
          />
          {categories.map((category) => (
            <FilterChip
              key={category.slug}
              href={buildHref({
                category: category.slug,
                sort: currentSort,
                q: currentQuery,
                trending,
              })}
              active={currentCategory === category.slug}
              label={category.name}
              count={category.count}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Sort</h3>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => (
            <FilterChip
              key={option.value}
              href={buildHref({
                category: currentCategory,
                sort: option.value,
                q: currentQuery,
                trending,
              })}
              active={currentSort === option.value}
              label={option.label}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Spotlight</h3>
        <FilterChip
          href={buildHref({
            category: currentCategory,
            sort: currentSort,
            q: currentQuery,
            trending: true,
          })}
          active={trending}
          label="Trending only"
        />
      </div>
    </aside>
  );
}

function FilterChip({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-all duration-200",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
          : "border-border/80 bg-white text-foreground/85 hover:border-primary/35 hover:bg-primary/5",
      )}
    >
      <span>{label}</span>
      {typeof count === "number" ? (
        <span
          className={cn(
            "text-[11px] tabular-nums",
            active ? "text-primary-foreground/75" : "text-muted-foreground",
          )}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}

function ActiveChip({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full bg-[#eef2ff] px-3 py-1.5 text-xs font-medium text-primary ring-1 ring-primary/15 transition-colors hover:bg-primary/10"
    >
      {label}
      <X className="size-3.5 opacity-70" />
    </Link>
  );
}

export function ProductPagination({
  page,
  totalPages,
  category,
  sort,
  q,
  trending,
}: {
  page: number;
  totalPages: number;
  category?: string;
  sort: ProductSort;
  q?: string;
  trending?: boolean;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  const items: (number | "…")[] = [];
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i]! - pages[i - 1]! > 1) items.push("…");
    items.push(pages[i]!);
  }

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      <Link
        href={buildHref({
          category,
          sort,
          q,
          trending,
          page: Math.max(1, page - 1),
        })}
        className={cn(
          "rounded-full px-3.5 py-2 text-sm",
          page <= 1
            ? "pointer-events-none text-muted-foreground/40"
            : "text-foreground hover:bg-muted",
        )}
        aria-disabled={page <= 1}
      >
        Previous
      </Link>

      {items.map((item, index) =>
        item === "…" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={buildHref({ category, sort, q, trending, page: item })}
            className={cn(
              "flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
              item === page
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "hover:bg-muted",
            )}
          >
            {item}
          </Link>
        ),
      )}

      <Link
        href={buildHref({
          category,
          sort,
          q,
          trending,
          page: Math.min(totalPages, page + 1),
        })}
        className={cn(
          "rounded-full px-3.5 py-2 text-sm",
          page >= totalPages
            ? "pointer-events-none text-muted-foreground/40"
            : "text-foreground hover:bg-muted",
        )}
        aria-disabled={page >= totalPages}
      >
        Next
      </Link>
    </nav>
  );
}
