import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PendingLinkOverlay } from "@/components/layout/pending-link-overlay";

export type CategoryTile = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  productCount: number;
};

export function CategoryShowcase({
  categories,
}: {
  categories: CategoryTile[];
}) {
  return (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:gap-5">
      {categories.map((category, index) => {
        const featured = index === 0;
        return (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            prefetch
            className={cn(
              "group relative isolate overflow-hidden rounded-2xl bg-[#1a2744]",
              featured
                ? "min-h-[280px] sm:min-h-[320px] lg:col-span-2 lg:row-span-2 lg:min-h-full"
                : "min-h-[200px] sm:min-h-[220px]",
            )}
          >
            <PendingLinkOverlay />
            {category.imageUrl ? (
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                quality={65}
                sizes={
                  featured
                    ? "(max-width: 1024px) 100vw, 50vw"
                    : "(max-width: 1024px) 50vw, 25vw"
                }
                className="object-cover"
              />
            ) : null}

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5 transition-opacity duration-500 group-hover:from-black/80" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
              <div>
                <h3
                  className={cn(
                    "font-display font-semibold tracking-tight text-white",
                    featured ? "text-2xl sm:text-3xl" : "text-xl",
                  )}
                >
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-white/70">
                  {category.productCount} products
                </p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
