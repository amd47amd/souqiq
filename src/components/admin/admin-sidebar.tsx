"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderTree,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { AdminNavLink } from "@/components/admin/admin-nav-link";
import { AdminUnseenBadge } from "@/components/admin/admin-unseen-badge";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/shipping", label: "Shipping", icon: MapPin },
] as const;

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-border bg-white lg:w-64 lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between px-5 py-5">
        <div>
          <Link href="/admin" prefetch className="font-display text-xl font-bold text-primary">
            SouqIQ
          </Link>
          <p className="text-xs text-muted-foreground">Admin panel</p>
        </div>
        <Button asChild variant="outline" size="sm" className="lg:hidden">
          <Link href="/">Store</Link>
        </Button>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-6">
        {LINKS.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <AdminNavLink key={link.href} href={link.href} active={active}>
              <Icon className="size-4" />
              {link.label}
              {link.href === "/admin/orders" ? <AdminUnseenBadge /> : null}
            </AdminNavLink>
          );
        })}
      </nav>

      <div className="mt-auto hidden border-t border-border p-4 lg:block">
        <p className="truncate text-sm font-medium">{adminName}</p>
        <div className="mt-3 flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href="/">View store</Link>
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
