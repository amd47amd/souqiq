import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/layout/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { HomeHero } from "@/components/home/home-hero";
import { HomeHowItWorks } from "@/components/home/home-how-it-works";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { SectionHeading } from "@/components/home/section-heading";
import { HomeCodBanner } from "@/components/home/home-cod-banner";
import { ProductGrid } from "@/components/products/product-card";
import { APP_NAME } from "@/lib/constants";
import {
  getCategories,
  getFeaturedProducts,
  getTrendingProducts,
} from "@/lib/products";

export const revalidate = 120;

export default async function HomePage() {
  const [categories, featured, trending] = await Promise.all([
    getCategories(),
    getFeaturedProducts(4),
    getTrendingProducts(4),
  ]);

  const heroImage =
    featured[0]?.images[0]?.url ??
    trending[0]?.images[0]?.url ??
    categories[0]?.imageUrl ??
    null;

  const heroAlt =
    featured[0]?.name ??
    trending[0]?.name ??
    categories[0]?.name ??
    `${APP_NAME} marketplace`;

  return (
    <PageTransition>
      <HomeHero imageUrl={heroImage} imageAlt={heroAlt} />

      <Reveal>
        <HomeHowItWorks />
      </Reveal>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            title="Shop by category"
            description={`Curated collections that define ${APP_NAME}.`}
            href="/categories"
            linkLabel="All categories"
          />
        </Reveal>
        <Reveal delay={80}>
          <CategoryShowcase
            categories={categories.map((category) => ({
              id: category.id,
              name: category.name,
              slug: category.slug,
              imageUrl: category.imageUrl,
              productCount: category._count.products,
            }))}
          />
        </Reveal>
      </section>

      {trending.length > 0 && (
        <section className="border-y border-border/80 bg-white/70">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <Reveal>
              <SectionHeading
                title="Trending now"
                description="What shoppers across Iraq are choosing this week."
                href="/products?trending=1"
                linkLabel="Explore products"
              />
            </Reveal>
            <Reveal delay={90}>
              <ProductGrid products={trending} priorityCount={2} />
            </Reveal>
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Reveal>
            <SectionHeading
              title="Featured picks"
              description="Hand-selected pieces from the catalog."
              href="/products"
              linkLabel="View catalog"
            />
          </Reveal>
          <Reveal delay={90}>
            <ProductGrid products={featured} />
          </Reveal>
        </section>
      )}

      <Reveal>
        <HomeCodBanner />
      </Reveal>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal subtle>
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#f3f5f8] px-6 py-8 sm:flex-row sm:items-center sm:px-8">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                Looking for something specific?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse the full catalog or jump into a category.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/products">
                  All products
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/categories">Categories</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </PageTransition>
  );
}
