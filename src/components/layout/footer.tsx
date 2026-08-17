import Link from "next/link";
import { APP_NAME, DEFAULT_WHATSAPP_NUMBER, FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
  const year = 2026;
  const whatsappHref = `https://wa.me/${DEFAULT_WHATSAPP_NUMBER.replace(/\D/g, "")}`;

  return (
    <footer className="mt-auto border-t border-border/80 bg-[#f7f8fb]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8 lg:py-20">
        <div className="md:col-span-2 lg:col-span-1">
          <Link
            href="/"
            className="font-display text-2xl font-bold tracking-tight text-primary"
          >
            {APP_NAME}
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Premium shopping across Iraq. Cash on delivery to every governorate —
            clothing, electronics, home, and fragrance.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Cash on delivery", "18 governorates", "Prices in IQD"].map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full border border-border/80 bg-white px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground"
                >
                  {label}
                </span>
              ),
            )}
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex text-sm font-medium text-accent-brown transition-colors hover:text-accent-brown/80"
          >
            WhatsApp: {DEFAULT_WHATSAPP_NUMBER}
          </a>
        </div>

        <FooterColumn title="Shop" links={FOOTER_LINKS.shop} />
        <FooterColumn title="Company" links={FOOTER_LINKS.company} />
        <FooterColumn title="Account" links={FOOTER_LINKS.account} />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div>
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs tracking-wide">
            Prices in Iraqi Dinar (IQD) · COD nationwide
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="font-display text-sm font-semibold tracking-wide text-foreground uppercase">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
