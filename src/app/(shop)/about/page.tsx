import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-medium tracking-[0.18em] text-primary uppercase">
          Our story
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
          About {APP_NAME}
        </h1>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
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
          <p className="text-accent-brown">
            Delivering to all 18 Iraqi governorates.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
