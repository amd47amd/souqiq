import Link from "next/link";
import Image from "next/image";
import { SearchX } from "lucide-react";
import { cn, formatIQD } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { PendingLinkOverlay } from "@/components/layout/pending-link-overlay";
import {
  getDisplayPrice,
  type ProductCardData,
} from "@/lib/products";

export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductCardData;
  priority?: boolean;
}) {
  const primary = product.images[0];
  const { price, compareAtPrice } = getDisplayPrice(product);
  const onSale = !!compareAtPrice && compareAtPrice > price;
  const stock = product.variants[0]?.stock ?? 0;
  const outOfStock = stock <= 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="product-card group relative block aspect-[4/5] overflow-hidden rounded-[1.25rem] outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2"
      prefetch
    >
      <PendingLinkOverlay />
      <div className="absolute inset-0 bg-[#dfe3ea]">
        {primary ? (
          <Image
            src={primary.url}
            alt={primary.alt ?? product.name}
            fill
            priority={priority}
            quality={65}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="soft-zoom object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,16,32,0.08)_0%,rgba(10,16,32,0.05)_35%,rgba(10,16,32,0.55)_78%,rgba(10,16,32,0.82)_100%)]" />

      <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {onSale && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-accent-foreground uppercase">
              Sale
            </span>
          )}
          {product.isTrending && !onSale && (
            <span className="rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white uppercase">
              Trending
            </span>
          )}
        </div>
        {outOfStock && (
          <span className="rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white uppercase">
            Sold out
          </span>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
        <p className="text-[10px] font-medium tracking-[0.2em] text-white/65 uppercase sm:text-[11px]">
          {product.category.name}
        </p>
        <h3 className="mt-1.5 line-clamp-2 font-display text-[15px] font-semibold leading-snug tracking-tight text-white sm:text-base">
          {product.name}
        </h3>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            {product.hasVariants && (
              <span className="text-[10px] font-medium text-white/55">From</span>
            )}
            <span className="text-[15px] font-semibold tracking-tight text-white sm:text-base">
              {formatIQD(price)}
            </span>
            {onSale && (
              <span className="text-xs text-white/45 line-through">
                {formatIQD(compareAtPrice!)}
              </span>
            )}
          </div>

          <span
            aria-hidden="true"
            className={cn(
              "inline-flex h-8 shrink-0 items-center rounded-full bg-white/20 px-3 text-[11px] font-semibold text-white",
              "opacity-80 sm:opacity-0 sm:transition-opacity sm:duration-700 sm:ease-[cubic-bezier(0.16,1,0.3,1)] sm:group-hover:opacity-100",
            )}
          >
            View
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({
  products,
  className,
  priorityCount = 0,
}: {
  products: ProductCardData[];
  className?: string;
  /** Only the first visible cards should preload — extra priority fights LCP. */
  priorityCount?: number;
}) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="size-7" strokeWidth={1.75} />}
        title="No products found"
        description="Try another category, search term, or clear your filters."
        actionHref="/products"
        actionLabel="View all products"
      />
    );
  }

  return (
    <div
      className={cn(
        "product-grid grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}
