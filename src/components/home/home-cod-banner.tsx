import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export function HomeCodBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="banner-glow absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.16),transparent_40%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-white/70 uppercase">
            <span className="live-dot size-1.5 rounded-full bg-[#c4a574]" />
            Cash on delivery
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-[2.15rem]">
            Pay when it arrives — nationwide with {APP_NAME}.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
            Order today and receive your package across all Iraqi governorates.
            No prepayment. No surprise currency.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="group h-12 rounded-full bg-white px-7 text-primary hover:bg-white/95"
          >
            <Link href="/products">
              Start shopping
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-white/30 bg-white/10 px-7 text-white hover:bg-white/20 hover:text-white"
          >
            <Link href="/categories">Browse categories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
