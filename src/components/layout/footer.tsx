import Link from "next/link";
import { APP_NAME, DEFAULT_WHATSAPP_NUMBER, FOOTER_LINKS } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const year = 2026;
  const whatsappHref = `https://wa.me/${DEFAULT_WHATSAPP_NUMBER.replace(/\D/g, "")}`;

  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
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

      <Separator />

      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          © {year} {APP_NAME}. All rights reserved.
        </p>
        <p className="text-xs">Prices in Iraqi Dinar (IQD) · COD available nationwide</p>
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
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
