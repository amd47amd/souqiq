import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { ProductGrid } from "@/components/products/product-card";
import {
  ProductFilters,
  ProductPagination,
} from "@/components/products/product-filters";
import {
  getCategories,
  getProducts,
  type ProductSort,
} from "@/lib/products";

type SearchParams = Promise<{
  category?: string;
  q?: string;
  sort?: string;
  page?: string;
  trending?: string;
}>;

const SORTS: ProductSort[] = ["newest", "price-asc", "price-desc", "name"];

function parseSort(value?: string): ProductSort {
  return SORTS.includes(value as ProductSort)
    ? (value as ProductSort)
    : "newest";
}

export const metadata: Metadata = {
  title: "Products",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const category = params.category;
  const q = params.q?.trim() || undefined;
  const sort = parseSort(params.sort);
  const page = Math.max(1, Number(params.page) || 1);
  const trending = params.trending === "1" || params.trending === "true";

  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({ category, q, sort, page, trending: trending || undefined }),
  ]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {trending ? "Trending" : "Products"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {q
              ? `Results for “${q}”`
              : trending
                ? "What shoppers across Iraq are choosing right now."
                : "Browse the full SouqIQ catalog across Iraq."}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr] xl:grid-cols-[240px_1fr]">
          <ProductFilters
            categories={categories.map((c) => ({
              slug: c.slug,
              name: c.name,
              count: c._count.products,
            }))}
            currentCategory={category}
            currentSort={sort}
            currentQuery={q}
            trending={trending}
            total={result.total}
          />

          <div>
            <ProductGrid products={result.products} />
            <ProductPagination
              page={result.page}
              totalPages={result.totalPages}
              category={category}
              sort={sort}
              q={q}
              trending={trending}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
