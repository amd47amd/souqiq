import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

type Props = {
  imageUrl?: string | null;
  imageAlt?: string;
};

export function HomeHero({ imageUrl, imageAlt = "SouqIQ marketplace" }: Props) {
  return (
    <section className="relative isolate min-h-[min(78dvh,720px)] overflow-hidden bg-[#0f1f4d]">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          quality={65}
          sizes="(max-width: 768px) 100vw, 1600px"
          className="hero-kenburns object-cover object-center"
        />
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(12,28,72,0.92)_0%,rgba(18,40,110,0.78)_42%,rgba(139,94,60,0.45)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,255,255,0.14),transparent_42%)]" />
      <div
        aria-hidden
        className="orb-drift pointer-events-none absolute -left-24 top-16 size-72 rounded-full bg-[radial-gradient(circle,rgba(196,165,116,0.32),transparent_68%)]"
      />
      <div
        aria-hidden
        className="orb-drift-slow pointer-events-none absolute right-[-12%] top-[12%] size-96 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16),transparent_70%)]"
      />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />

      <div className="relative mx-auto flex min-h-[min(78dvh,720px)] max-w-7xl flex-col justify-end px-4 pb-16 pt-24 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <div className="hero-enter max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-white/80 uppercase">
            <span className="live-dot size-1.5 rounded-full bg-emerald-400" />
            Delivering nationwide
          </p>
          <h1 className="mt-4 font-display text-6xl font-bold tracking-[-0.04em] text-white sm:text-7xl lg:text-8xl">
            {APP_NAME}
          </h1>
          <p className="hero-enter-delay mt-5 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
            Clothing, electronics, home, and fragrance — curated for Iraq, paid
            on delivery.
          </p>
          <div className="hero-enter-delay mt-9 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="group h-12 rounded-full bg-white px-7 text-primary hover:bg-white/95"
            >
              <Link href="/products">
                Shop the collection
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/35 bg-white/10 px-7 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/categories">Browse categories</Link>
            </Button>
          </div>

          <ul className="hero-enter-delay mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold tracking-[0.16em] text-white/65 uppercase">
            <li>Cash on delivery</li>
            <li aria-hidden className="h-1 w-1 rounded-full bg-white/40" />
            <li>18 governorates</li>
            <li aria-hidden className="hidden h-1 w-1 rounded-full bg-white/40 sm:block" />
            <li className="hidden sm:block">Prices in IQD</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
