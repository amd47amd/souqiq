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
    <section className="relative isolate min-h-[max(640px,min(92dvh,880px))] overflow-hidden bg-[#0f1f4d]">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          quality={70}
          sizes="100vw"
          className="object-cover object-center"
        />
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(12,28,72,0.92)_0%,rgba(18,40,110,0.78)_42%,rgba(139,94,60,0.45)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,255,255,0.14),transparent_42%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative mx-auto flex min-h-[max(640px,min(92dvh,880px))] max-w-7xl flex-col justify-end px-4 pb-20 pt-28 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-white/70 uppercase sm:text-xs">
            Marketplace · Iraq
          </p>
          <h1 className="mt-4 font-display text-6xl font-bold tracking-[-0.04em] text-white sm:text-7xl lg:text-8xl">
            {APP_NAME}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
            Premium goods with cash on delivery to every governorate.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 bg-white px-6 text-primary shadow-lg shadow-black/10 hover:bg-white/95"
            >
              <Link href="/products">
                Shop the collection
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/35 bg-white/5 px-6 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
            >
              <Link href="/categories">Browse categories</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
