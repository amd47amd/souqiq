import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Package, MapPin, RotateCcw } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel";
import { ProductGrid } from "@/components/products/product-card";
import { SectionHeading } from "@/components/home/section-heading";
import {
  getAllProductSlugs,
  getProductBySlug,
  getProducts,
} from "@/lib/products";
import { parseProductSpecs } from "@/lib/product-details";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 120;

export async function generateStaticParams() {
  const products = await getAllProductSlugs();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: (product.shortDescription || product.description).slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.variants.length === 0) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <Reveal subtle>
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
        >
        <Link href="/products" className="transition-colors hover:text-primary">
          Products
        </Link>
        <ChevronRight className="size-3.5 opacity-50" />
        <Link
          href={`/products?category=${product.category.slug}`}
          className="transition-colors hover:text-primary"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="size-3.5 opacity-50" />
        <span className="line-clamp-1 font-medium text-foreground">
          {product.name}
        </span>
      </nav>
      </Reveal>

      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
        <Reveal>
          <ProductGallery images={product.images} productName={product.name} />
        </Reveal>
        <Reveal delay={90} subtle>
          <ProductPurchasePanel
            product={{
              ...product,
              specs: parseProductSpecs(product.specs),
            }}
          />
        </Reveal>
      </div>

      <Reveal delay={40}>
        <section className="mt-14 grid gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-16">
        <DetailCard
          icon={<Package className="size-5" />}
          title={product.highlights.length ? "Highlights" : "What’s included"}
          text={
            product.highlights.length
              ? product.highlights.join(" · ")
              : product.hasVariants
                ? "Choose your preferred options before checkout. Exact stock is checked when you place the order."
                : product.description
          }
        />
        <DetailCard
          icon={<MapPin className="size-5" />}
          title="Delivery across Iraq"
          text="We ship to every governorate with clear COD shipping fees shown at checkout."
        />
        <DetailCard
          icon={<RotateCcw className="size-5" />}
          title="Order support"
          text="Need help after ordering? Reach us on WhatsApp and we will assist with your delivery."
        />
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-14 overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,#143a9e_0%,#1a56db_48%,#8b5e3c_145%)] px-6 py-8 text-white sm:px-8 sm:py-9 lg:mt-16">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-white/70 uppercase">
          Why shop this item
        </p>
        <h2 className="mt-2 max-w-2xl font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Premium selection with cash on delivery — no online payment needed.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
          Add to cart, confirm your governorate, and pay when your package
          arrives. Simple, local, and built for shopping across Iraq.
        </p>
        </section>
      </Reveal>

      <Suspense
        fallback={
          <div className="mt-16 border-t border-border/80 pt-14">
            <Skeleton className="h-8 w-56" />
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] rounded-[1.25rem]" />
              ))}
            </div>
          </div>
        }
      >
        <RelatedProducts
          categorySlug={product.category.slug}
          categoryName={product.category.name}
          excludeId={product.id}
        />
      </Suspense>
    </div>
  );
}

async function RelatedProducts({
  categorySlug,
  categoryName,
  excludeId,
}: {
  categorySlug: string;
  categoryName: string;
  excludeId: string;
}) {
  const related = await getProducts({
    category: categorySlug,
    page: 1,
  });
  const relatedProducts = related.products
    .filter((p) => p.id !== excludeId)
    .slice(0, 4);

  if (relatedProducts.length === 0) return null;

  return (
    <Reveal>
      <section className="mt-16 border-t border-border/80 pt-14 lg:mt-20">
        <SectionHeading
          eyebrow="Related"
          title={`More in ${categoryName}`}
          description="Continue exploring this collection."
          href={`/products?category=${categorySlug}`}
          linkLabel="View all"
        />
        <ProductGrid products={relatedProducts} />
      </section>
    </Reveal>
  );
}

function DetailCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="soft-lift rounded-2xl border border-border/80 bg-white/80 p-5 sm:p-6">
      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-base font-semibold tracking-tight">
        {title}
      </h3>
      <p className="mt-2 line-clamp-5 text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
