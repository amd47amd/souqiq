import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PendingLinkOverlay } from "@/components/layout/pending-link-overlay";
import { formatIQD } from "@/lib/utils";
import { getDisplayPrice, type ProductCardData } from "@/lib/products";

function excerpt(text: string, max = 170) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

export function HomeSpotlight({ product }: { product: ProductCardData }) {
  const image = product.images[0];
  const { price, compareAtPrice } = getDisplayPrice(product);
  const onSale = !!compareAtPrice && compareAtPrice > price;

  return (
    <section className="relative overflow-hidden bg-[#0f1f4d]">
      <div
        aria-hidden
        className="orb-drift pointer-events-none absolute -left-16 top-10 size-64 rounded-full bg-[radial-gradient(circle,rgba(196,165,116,0.22),transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-7xl lg:grid-cols-2">
        <Link
          href={`/products/${product.slug}`}
          prefetch
          className="group relative isolate min-h-[380px] overflow-hidden sm:min-h-[460px] lg:min-h-[560px]"
        >
          <PendingLinkOverlay />
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              quality={70}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="soft-zoom object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[#1a2744]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f4d]/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0f1f4d]/35" />
        </Link>

        <div className="relative flex flex-col justify-center px-4 py-12 sm:px-8 sm:py-16 lg:px-14 lg:py-20">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-[#c4a574] uppercase">
            <span className="live-dot size-1.5 rounded-full bg-[#c4a574]" />
            Editor&apos;s pick
          </p>
          <p className="mt-4 text-[11px] font-semibold tracking-[0.2em] text-white/55 uppercase">
            {product.category.name}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {product.name}
          </h2>
          {product.description ? (
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-[15px]">
              {excerpt(product.description)}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-2xl font-semibold text-white">
              {product.hasVariants ? `From ${formatIQD(price)}` : formatIQD(price)}
            </span>
            {onSale ? (
              <span className="text-sm text-white/45 line-through">
                {formatIQD(compareAtPrice!)}
              </span>
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="group h-12 rounded-full bg-white px-7 text-primary hover:bg-white/95"
            >
              <Link href={`/products/${product.slug}`}>
                View this piece
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/30 bg-white/10 px-7 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/products">Full catalog</Link>
            </Button>
          </div>

          <p className="mt-6 text-xs tracking-wide text-white/50">
            Cash on delivery · Ships to every Iraqi governorate
          </p>
        </div>
      </div>
    </section>
  );
}
