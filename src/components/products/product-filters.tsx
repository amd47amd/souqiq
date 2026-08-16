import Link from "next/link";
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
  total: number;
};

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name A–Z" },
];

function buildHref(params: {
  category?: string;
  sort?: string;
  q?: string;
  page?: number;
}) {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.sort && params.sort !== "newest") search.set("sort", params.sort);
  if (params.q) search.set("q", params.q);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  const qs = search.toString();
  return qs ? `/products?${qs}` : "/products";
}

export function ProductFilters({
  categories,
  currentCategory,
  currentSort,
  currentQuery,
  total,
}: Props) {
  return (
    <aside className="space-y-6">
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {total} product{total === 1 ? "" : "s"}
        </p>
        <h2 className="mt-1 font-display text-lg font-semibold">Filters</h2>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Category</h3>
        <ul className="space-y-1">
          <li>
            <Link
              href={buildHref({ sort: currentSort, q: currentQuery })}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                !currentCategory
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-foreground/80 hover:bg-muted",
              )}
            >
              All products
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={buildHref({
                  category: category.slug,
                  sort: currentSort,
                  q: currentQuery,
                })}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  currentCategory === category.slug
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-foreground/80 hover:bg-muted",
                )}
              >
                <span>{category.name}</span>
                <span className="text-xs text-muted-foreground">
                  {category.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Sort by</h3>
        <ul className="space-y-1">
          {SORT_OPTIONS.map((option) => (
            <li key={option.value}>
              <Link
                href={buildHref({
                  category: currentCategory,
                  sort: option.value,
                  q: currentQuery,
                })}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm transition-colors",
                  currentSort === option.value
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-foreground/80 hover:bg-muted",
                )}
              >
                {option.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {currentQuery && (
        <Link
          href={buildHref({
            category: currentCategory,
            sort: currentSort,
          })}
          className="inline-flex text-sm font-medium text-accent-brown hover:underline"
        >
          Clear search “{currentQuery}”
        </Link>
      )}
    </aside>
  );
}

export function ProductPagination({
  page,
  totalPages,
  category,
  sort,
  q,
}: {
  page: number;
  totalPages: number;
  category?: string;
  sort: ProductSort;
  q?: string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  const items: (number | "…")[] = [];
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i] - pages[i - 1]! > 1) items.push("…");
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
          page: Math.max(1, page - 1),
        })}
        className={cn(
          "rounded-md px-3 py-2 text-sm",
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
            href={buildHref({ category, sort, q, page: item })}
            className={cn(
              "flex size-9 items-center justify-center rounded-md text-sm font-medium",
              item === page
                ? "bg-primary text-primary-foreground"
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
          page: Math.min(totalPages, page + 1),
        })}
        className={cn(
          "rounded-md px-3 py-2 text-sm",
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
