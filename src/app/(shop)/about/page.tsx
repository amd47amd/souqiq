import type { Metadata } from "next";
import Link from "next/link";
import { PageTransition } from "@/components/layout/page-transition";
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

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal subtle>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
            Our story
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            About {APP_NAME}
          </h1>
        </Reveal>

        <Reveal delay={60}>
          <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-muted-foreground sm:text-[17px]">
            <p>
              {APP_NAME} is built for shoppers across Iraq who want a premium,
              modern marketplace — clear prices in IQD, reliable cash on delivery,
              and a carefully curated selection.
            </p>
            <p>
              From clothing and electronics to home appliances and fragrances, we
              focus on quality presentation, transparent shipping by governorate,
              and a checkout experience that respects your time.
            </p>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <ul className="mt-12 grid gap-3 sm:grid-cols-3">
            {STATS.map((stat) => (
              <li
                key={stat.label}
                className="rounded-[1.35rem] border border-border/80 bg-white px-6 py-7 text-center shadow-[0_16px_40px_-32px_rgba(18,21,26,0.4)]"
              >
                <p className="font-display text-3xl font-semibold tracking-tight text-primary">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120} subtle>
          <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-[1.5rem] bg-[#f7f8fb] px-6 py-8 sm:flex-row sm:items-center sm:px-8">
            <p className="font-display text-lg font-semibold tracking-tight">
              Delivering to all 18 Iraqi governorates.
            </p>
            <Button asChild>
              <Link href="/products">Browse the catalog</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </PageTransition>
  );
}
