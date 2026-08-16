import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { PageTransition } from "@/components/layout/page-transition";
import { Button } from "@/components/ui/button";
import { DEFAULT_WHATSAPP_NUMBER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  const whatsappHref = `https://wa.me/${DEFAULT_WHATSAPP_NUMBER.replace(/\D/g, "")}`;

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Contact Us
        </h1>
        <p className="mt-4 text-muted-foreground">
          Questions about an order or product? Reach us on WhatsApp — we usually
          reply within business hours.
        </p>
        <div className="mt-10 rounded-xl border border-border bg-white p-8">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            WhatsApp
          </p>
          <p className="mt-2 font-display text-2xl font-semibold text-foreground">
            {DEFAULT_WHATSAPP_NUMBER}
          </p>
          <Button asChild className="mt-6" size="lg">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" />
              Chat on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
