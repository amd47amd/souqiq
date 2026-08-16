import { MousePointerClick, ClipboardList, Banknote } from "lucide-react";
import { SectionHeading } from "@/components/home/section-heading";
import { APP_NAME } from "@/lib/constants";

const STEPS = [
  {
    icon: MousePointerClick,
    title: "Choose your items",
    text: "Browse curated products across clothing, electronics, home, and fragrance.",
  },
  {
    icon: ClipboardList,
    title: "Place your order",
    text: "Confirm your governorate and delivery details in a short checkout.",
  },
  {
    icon: Banknote,
    title: "Pay on delivery",
    text: `Cash on delivery with ${APP_NAME} — pay when your package arrives.`,
  },
] as const;

export function HomeHowItWorks() {
  return (
    <section className="border-y border-border/70 bg-[#f7f8fb]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          title="How it works"
          description="Three simple steps from browsing to cash on delivery."
        />

        <ol className="grid gap-10 sm:grid-cols-3 sm:gap-8 lg:gap-12">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="relative">
                {index < STEPS.length - 1 ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-7 left-[calc(50%+2.5rem)] hidden h-px w-[calc(100%-1.5rem)] bg-gradient-to-r from-primary/35 to-transparent sm:block"
                  />
                ) : null}

                <div className="flex items-start gap-4 sm:flex-col sm:items-start sm:gap-5">
                  <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-[0_10px_30px_-18px_rgba(26,86,219,0.55)] ring-1 ring-primary/10">
                    <Icon className="size-5" strokeWidth={1.75} />
                    <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white">
                      {index + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
