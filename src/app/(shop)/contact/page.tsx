import type { Metadata } from "next";
import { MessageCircle, Clock3, MapPin } from "lucide-react";
import { PageTransition } from "@/components/layout/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { DEFAULT_WHATSAPP_NUMBER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  const whatsappHref = `https://wa.me/${DEFAULT_WHATSAPP_NUMBER.replace(/\D/g, "")}`;

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal subtle>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
            Support
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground sm:text-[17px]">
            Questions about an order or product? Reach us on WhatsApp — we usually
            reply within business hours.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <div className="rounded-[1.5rem] border border-border/80 bg-white p-8 shadow-[0_18px_50px_-36px_rgba(18,21,26,0.45)] sm:p-10">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                WhatsApp
              </p>
              <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
                {DEFAULT_WHATSAPP_NUMBER}
              </p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Send a message with your order number or the product you are
                asking about — we will help you from there.
              </p>
              <Button asChild className="mt-8 h-12 rounded-full px-6" size="lg">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="grid gap-4">
              <div className="rounded-[1.35rem] bg-[#f7f8fb] px-6 py-6">
                <Clock3 className="size-5 text-primary" strokeWidth={1.75} />
                <p className="mt-4 font-display text-base font-semibold">
                  Business hours
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Saturday – Thursday, 10:00 – 20:00 (Iraq time).
                </p>
              </div>
              <div className="rounded-[1.35rem] bg-[#f7f8fb] px-6 py-6">
                <MapPin className="size-5 text-primary" strokeWidth={1.75} />
                <p className="mt-4 font-display text-base font-semibold">
                  Nationwide delivery
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Cash on delivery to every Iraqi governorate.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  );
}
