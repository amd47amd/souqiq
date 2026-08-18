import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Banknote, Gem, MapPinned } from "lucide-react";
import { PageTransition } from "@/components/layout/page-transition";
import { PageIntro } from "@/components/layout/page-intro";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
};

const STATS = [
  { value: "18", label: "Governorates" },
  { value: "COD", label: "Pay on arrival" },
  { value: "IQD", label: "Local pricing" },
] as const;

const VALUES = [
  {
    icon: Gem,
    title: "Curated products",
    text: "We focus on items that feel presentable, useful, and worth discovering.",
  },
  {
    icon: Banknote,
    title: "Clear buying",
    text: "Prices stay in IQD and payment happens on delivery, with no extra complexity.",
  },
  {
    icon: MapPinned,
    title: "Built for Iraq",
    text: "Shipping, checkout, and catalog decisions are shaped around local shoppers.",
  },
] as const;

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Reveal subtle>
          <PageIntro
            eyebrow="Our story"
            title={`About ${APP_NAME}`}
            description={`${APP_NAME} is a modern Iraqi storefront built around elegant presentation, clear IQD pricing, and cash on delivery that feels simple from first click to final order.`}
          />
        </Reveal>

        <Reveal delay={60}>
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:gap-5">
            <div className="relative overflow-hidden rounded-[1.6rem] bg-[#0f1f4d] px-6 py-8 text-white sm:px-8 sm:py-10">
              <div
                aria-hidden
                className="orb-drift pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-[radial-gradient(circle,rgba(196,165,116,0.26),transparent_70%)]"
              />
              <div className="relative max-w-2xl">
                <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-white/60 uppercase">
                  <span className="live-dot size-1.5 rounded-full bg-[#c4a574]" />
                  Premium by design
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  A cleaner way to shop across Iraq.
                </h2>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-white/75 sm:text-[15px]">
                  <p>
                    {APP_NAME} was shaped for shoppers who want something more
                    polished than a basic catalog: better presentation, simpler
                    decisions, and a storefront that feels trustworthy at first
                    glance.
                  </p>
                  <p>
                    From clothing and electronics to home goods and fragrance, we
                    care about clarity in pricing, smooth browsing, and delivery
                    that works the way Iraqi customers already prefer: cash on
                    delivery, governorate-aware shipping, and no unnecessary steps.
                  </p>
                </div>
              </div>
            </div>

            <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {STATS.map((stat) => (
                <li
                  key={stat.label}
                  className="soft-lift rounded-[1.35rem] border border-border/80 bg-white px-6 py-7 shadow-[0_16px_40px_-32px_rgba(18,21,26,0.4)]"
                >
                  <p className="font-display text-3xl font-semibold tracking-tight text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="mt-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              What defines {APP_NAME}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              The goal is not just to sell products, but to make the whole
              storefront feel clearer, calmer, and more premium.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <li
                  key={value.title}
                  className="soft-lift rounded-[1.35rem] bg-[#f7f8fb] px-6 py-6"
                >
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.text}
                  </p>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={150} subtle>
          <div className="mt-12 rounded-[1.6rem] border border-border/80 bg-white px-6 py-8 shadow-[0_18px_50px_-36px_rgba(18,21,26,0.45)] sm:px-8 sm:py-10">
            <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
                  <span className="live-dot size-1.5 rounded-full bg-accent" />
                  Nationwide
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">
                  Delivering to all 18 Iraqi governorates.
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Explore the catalog, compare categories, and order with the same
                  cash-on-delivery flow used across the storefront.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="group rounded-full px-6">
                  <Link href="/products">
                    Browse the catalog
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-6">
                  <Link href="/categories">View categories</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </PageTransition>
  );
}
