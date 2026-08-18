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
import { Button } from "@/components/ui/button";
import { AdminNavLink } from "@/components/admin/admin-nav-link";
import { AdminUnseenBadge } from "@/components/admin/admin-unseen-badge";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/users", label: "Customers", icon: Users },
  { href: "/admin/shipping", label: "Shipping", icon: MapPin },
] as const;

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
    <aside className="flex w-full flex-col border-b border-border/80 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between px-5 py-5">
        <div>
          <Link href="/admin" className="font-display text-lg font-bold tracking-tight text-foreground">
            SouqIQ
          </Link>
          <p className="mt-0.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Console
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="lg:hidden">
          <Link href="/">Store</Link>
        </Button>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-4">
        {LINKS.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <AdminNavLink key={link.href} href={link.href} active={active}>
              <Icon className="size-4 shrink-0 opacity-80" />
              {link.label}
              {link.href === "/admin/orders" ? <AdminUnseenBadge /> : null}
            </AdminNavLink>
          );
        })}
      </nav>

      <div className="hidden border-t border-border/80 p-4 lg:block">
        <p className="truncate text-sm font-medium">{adminName}</p>
        <p className="text-xs text-muted-foreground">Administrator</p>
        <div className="mt-3 flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href="/">
              <Store className="size-3.5" />
              Store
            </Link>
          </Button>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="icon" aria-label="Sign out">
              <LogOut className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}
