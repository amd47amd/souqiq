export const APP_NAME = "SouqIQ";

export const CURRENCY_CODE = "IQD";

export const DEFAULT_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+9647500000000";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { href: "/products", label: "All Products" },
    { href: "/categories", label: "Categories" },
    { href: "/products?sort=trending", label: "Trending" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ],
  account: [
    { href: "/login", label: "Sign In" },
    { href: "/register", label: "Create Account" },
  ],
} as const;
