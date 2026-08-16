import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/layout/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { ProductGrid } from "@/components/products/product-card";
import { ProductPagination } from "@/components/products/product-filters";
import {
  getCategoryBySlug,
  getProducts,
  type ProductSort,
} from "@/lib/products";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
};

const SORTS: ProductSort[] = ["newest", "price-asc", "price-desc", "name"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category?.name ?? "Category" };
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const sort = SORTS.includes(sp.sort as ProductSort)
    ? (sp.sort as ProductSort)
    : "newest";
  const page = Math.max(1, Number(sp.page) || 1);

  const result = await getProducts({
    category: slug,
    sort,
    page,
  });

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal subtle>
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/categories" className="hover:text-primary">
              Categories
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{category.name}</span>
          </nav>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-3 max-w-2xl text-muted-foreground">
                {category.description}
              </p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              {result.total} products
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <ProductGrid products={result.products} />
          <ProductPagination
            page={result.page}
            totalPages={result.totalPages}
            category={slug}
            sort={sort}
          />
        </Reveal>

        <Reveal delay={120} subtle>
          <div className="mt-8">
            <Link
              href={`/products?category=${slug}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Open in full catalog view
            </Link>
          </div>
        </Reveal>
      </div>
    </PageTransition>
  );
}
