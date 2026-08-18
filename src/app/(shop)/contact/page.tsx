import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Clock3, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { PageTransition } from "@/components/layout/page-transition";
import { PageIntro } from "@/components/layout/page-intro";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { DEFAULT_WHATSAPP_NUMBER } from "@/lib/constants";

const SUPPORT_ITEMS = [
  {
    icon: Clock3,
    title: "Business hours",
    text: "Saturday – Thursday, 10:00 – 20:00 (Iraq time).",
  },
  {
    icon: MapPin,
    title: "Nationwide delivery",
    text: "Cash on delivery to every Iraqi governorate.",
  },
  {
    icon: ShieldCheck,
    title: "Order support",
    text: "Share your order number or product link and we will guide you quickly.",
  },
] as const;

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  const whatsappHref = `https://wa.me/${DEFAULT_WHATSAPP_NUMBER.replace(/\D/g, "")}`;

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Reveal subtle>
          <PageIntro
            eyebrow="Support"
            title="Contact Us"
            description="Questions about a product, order, or delivery? Reach us on WhatsApp for the fastest help."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <div className="relative overflow-hidden rounded-[1.6rem] bg-[#0f1f4d] px-6 py-8 text-white sm:px-8 sm:py-10">
              <div
                aria-hidden
                className="orb-drift pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-[radial-gradient(circle,rgba(196,165,116,0.26),transparent_70%)]"
              />
              <div className="relative max-w-xl">
                <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-white/60 uppercase">
                  <span className="live-dot size-1.5 rounded-full bg-[#c4a574]" />
                  WhatsApp support
                </p>
                <p className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  {DEFAULT_WHATSAPP_NUMBER}
                </p>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-[15px]">
                  Send your order number, product link, or question and we will
                  help you from there. It is the fastest way to reach the store.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="group h-12 rounded-full bg-white px-6 text-primary hover:bg-white/95"
                  >
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="size-4" />
                      Chat on WhatsApp
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-full border-white/30 bg-white/10 px-6 text-white hover:bg-white/20 hover:text-white"
                  >
                    <Link href="/products">
                      Browse products
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="grid gap-4">
              {SUPPORT_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="soft-lift rounded-[1.35rem] bg-[#f7f8fb] px-6 py-6"
                  >
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </div>
                    <p className="mt-5 font-display text-base font-semibold tracking-tight text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>

        <Reveal delay={120} subtle>
          <div className="mt-12 rounded-[1.6rem] border border-border/80 bg-white px-6 py-8 shadow-[0_18px_50px_-36px_rgba(18,21,26,0.45)] sm:px-8 sm:py-10">
            <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
                  <span className="live-dot size-1.5 rounded-full bg-accent" />
                  Quick help
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">
                  Need help with a specific product?
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Open the catalog, copy the product link, and send it to us on
                  WhatsApp for the fastest answer.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="group rounded-full px-6">
                  <Link href="/products">
                    View catalog
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-6">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    Message us
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </PageTransition>
  );
}
