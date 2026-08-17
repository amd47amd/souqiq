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
          eyebrow="Process"
          title="How it works"
          description="Three simple steps from browsing to cash on delivery."
        />

        <ol className="grid gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="group relative overflow-hidden rounded-[1.35rem] border border-border/70 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(18,21,26,0.35)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(26,86,219,0.35)] sm:p-6"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-3 right-4 font-display text-5xl font-bold tracking-tight text-primary/10"
                >
                  0{index + 1}
                </span>
                <div className="relative flex items-start gap-4 sm:flex-col sm:items-start sm:gap-5">
                  <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
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
