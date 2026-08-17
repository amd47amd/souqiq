import { MessageCircle } from "lucide-react";
import { DEFAULT_WHATSAPP_NUMBER } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function WhatsAppFloat({ className }: Props) {
  const digits = DEFAULT_WHATSAPP_NUMBER.replace(/\D/g, "");
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(
    "Hi SouqIQ — I need help with an order.",
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener norepinephrine"
      aria-label="Chat on WhatsApp"
      className={cn(
        "fixed z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/50 focus-visible:ring-offset-2",
        "right-4 bottom-[max(1.25rem,env(safe-area-inset-bottom))] md:bottom-6",
        "max-md:bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.5rem))]",
        className,
      )}
    >
      <MessageCircle className="size-5 fill-white/20" strokeWidth={1.75} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
