import { Banknote, MapPinned, Coins, MessageCircle } from "lucide-react";
import { DEFAULT_WHATSAPP_NUMBER } from "@/lib/constants";

const ITEMS = [
  {
    icon: Banknote,
    title: "Cash on delivery",
    text: "Pay when the package arrives.",
  },
  {
    icon: MapPinned,
    title: "18 governorates",
    text: "From Baghdad to Basra.",
  },
  {
    icon: Coins,
    title: "Prices in IQD",
    text: "What you see is what you pay.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp help",
    text: DEFAULT_WHATSAPP_NUMBER,
    href: `https://wa.me/${DEFAULT_WHATSAPP_NUMBER.replace(/\D/g, "")}`,
  },
] as const;

export function HomeTrustStrip() {
  return (
    <section className="border-b border-border/70 bg-white">
      <ul className="mx-auto grid max-w-7xl gap-1 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const inner = (
            <>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-4" strokeWidth={1.75} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-foreground">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {item.text}
                </span>
              </span>
            </>
          );

          return (
            <li key={item.title}>
              {"href" in item ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-5 transition-colors hover:bg-[#f7f8fb] sm:px-6 lg:px-8"
                >
                  {inner}
                </a>
              ) : (
                <div className="flex items-center gap-3 px-4 py-5 sm:px-6 lg:px-8">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
