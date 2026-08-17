import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { PageIntro } from "@/components/layout/page-intro";
import { Reveal } from "@/components/motion/reveal";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { getCategories } from "@/lib/products";

export const metadata: Metadata = {
  title: "Categories",
};

export const revalidate = 120;

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal subtle>
          <PageIntro
            eyebrow="Collections"
            title="Categories"
            description="Four curated collections across the SouqIQ catalog."
          />
        </Reveal>
        <Reveal delay={70}>
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
      </div>
    </PageTransition>
  );
}
