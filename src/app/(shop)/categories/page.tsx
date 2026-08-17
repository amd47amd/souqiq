import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageTransition } from "@/components/layout/page-transition";
import { Reveal } from "@/components/motion/reveal";
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
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Categories
          </h1>
          <p className="mt-3 text-muted-foreground">
            Four curated collections across the SouqIQ catalog.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 70}>
              <Link
                href={`/categories/${category.slug}`}
                className="group overflow-hidden rounded-xl border border-border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      quality={65}
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : null}
                </div>
                <div className="p-5">
                  <h2 className="font-display text-xl font-semibold group-hover:text-primary">
                    {category.name}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {category._count.products} products
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
