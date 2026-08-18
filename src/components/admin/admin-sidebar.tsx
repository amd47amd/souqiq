"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderTree,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { AdminNavLink } from "@/components/admin/admin-nav-link";
import { AdminUnseenBadge } from "@/components/admin/admin-unseen-badge";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/users", label: "Customers", icon: Users },
  { href: "/admin/shipping", label: "Shipping", icon: MapPin },
] as const;

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const warm = async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 250));
      for (const link of LINKS) {
        if (cancelled || link.href === pathname) continue;
        router.prefetch(link.href);
      }
    };
    void warm();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return (
    <aside className="flex w-full flex-col border-b border-border/80 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between gap-3 px-4 py-4 lg:px-5 lg:py-5">
        <Link
          href="/admin"
          className="flex min-w-0 items-center gap-3 outline-none [-webkit-tap-highlight-color:transparent]"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary font-display text-sm font-bold text-white">
            S
          </span>
          <span className="min-w-0">
            <span className="block font-display text-[15px] font-bold tracking-tight text-foreground">
              SouqIQ
            </span>
            <span className="block text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
              Console
            </span>
          </span>
        </Link>
        <Link
          href="/"
          className="rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground outline-none hover:bg-muted hover:text-foreground lg:hidden [-webkit-tap-highlight-color:transparent]"
        >
          Store
        </Link>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-3 lg:pb-4">
        {LINKS.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <AdminNavLink key={link.href} href={link.href} active={active}>
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  active ? "bg-white text-primary shadow-sm" : "text-current",
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">{link.label}</span>
              {link.href === "/admin/orders" ? <AdminUnseenBadge /> : null}
            </AdminNavLink>
          );
        })}
      </nav>

      <div className="hidden border-t border-border/80 p-4 lg:block">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eef3ff] text-xs font-semibold text-primary">
            {initials(adminName)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{adminName}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-border bg-white text-xs font-medium text-foreground outline-none hover:bg-muted [-webkit-tap-highlight-color:transparent]"
          >
            <Store className="size-3.5" />
            Store
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-medium text-muted-foreground outline-none hover:bg-muted hover:text-foreground [-webkit-tap-highlight-color:transparent]"
            >
              <LogOut className="size-3.5" />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
