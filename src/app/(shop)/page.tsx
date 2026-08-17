import { PageTransition } from "@/components/layout/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { HomeHero } from "@/components/home/home-hero";
import { HomeMarquee } from "@/components/home/home-marquee";
import { HomeTrustStrip } from "@/components/home/home-trust-strip";
import { HomeHowItWorks } from "@/components/home/home-how-it-works";
import { HomeSpotlight } from "@/components/home/home-spotlight";
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
    getFeaturedProducts(6),
    getTrendingProducts(8),
  ]);

  const spotlight = featured[0] ?? null;
  const trendingIds = new Set(trending.map((product) => product.id));
  const featuredRest = featured.filter(
    (product) => product.id !== spotlight?.id && !trendingIds.has(product.id),
  );

  const heroSource =
    trending.find((product) => product.id !== spotlight?.id) ??
    featured[1] ??
    spotlight ??
    null;

  const heroImage =
    heroSource?.images[0]?.url ?? categories[0]?.imageUrl ?? null;

  const heroAlt =
    heroSource?.name ?? categories[0]?.name ?? `${APP_NAME} marketplace`;

  return (
    <PageTransition>
      <HomeHero imageUrl={heroImage} imageAlt={heroAlt} />
      <HomeMarquee />
      <HomeTrustStrip />

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Collections"
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
      )}

      {trending.length > 0 && (
        <section className="border-y border-border/80 bg-white/70">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="This week"
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

      {spotlight ? (
        <Reveal>
          <HomeSpotlight product={spotlight} />
        </Reveal>
      ) : null}

      {featuredRest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Selection"
              title="More from the edit"
              description="Further pieces chosen for the homepage."
              href="/products"
              linkLabel="View catalog"
            />
          </Reveal>
          <Reveal delay={90}>
            <ProductGrid products={featuredRest} />
          </Reveal>
        </section>
      )}

      <Reveal>
        <HomeHowItWorks />
      </Reveal>

      <Reveal>
        <HomeCodBanner />
      </Reveal>
    </PageTransition>
  );
}
