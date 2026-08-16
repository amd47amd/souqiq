import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export function HomeCodBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,#143a9e_0%,#1a56db_45%,#8b5e3c_140%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.16),transparent_40%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-white/70 uppercase">
            Cash on delivery
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Pay when it arrives — nationwide with {APP_NAME}.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
            Order today and receive your package across all Iraqi governorates.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="h-12 shrink-0 bg-white px-6 text-primary hover:bg-white/95"
        >
          <Link href="/products">
            Start shopping
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
