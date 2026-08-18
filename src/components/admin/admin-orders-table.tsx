"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, MessageCircle, Package, Search } from "lucide-react";
import { formatIQD } from "@/lib/utils";
import {
  formatAdminDate,
  groupOrdersByDay,
  ORDER_STATUS_LABEL,
  orderWhatsAppText,
  whatsappHref,
} from "@/lib/admin-format";
import { ORDER_STATUSES } from "@/types";
import type { OrderStatus } from "@/types";
import { AdminPanel, OrderStatusBadge } from "@/components/admin/admin-ui";

export type AdminOrderRow = {
  id: string;
  orderNumber: string;
  total: number;
  status: OrderStatus;
  isSeenByAdmin: boolean;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  governorateName: string;
  addressLine: string;
  notes: string | null;
  itemCount: number;
  itemPreview: string;
  itemImageUrl: string | null;
};

type Filter = "all" | OrderStatus;

const FILTERS: { id: Filter; label: string; hint: string }[] = [
  { id: "all", label: "All", hint: "Every COD order" },
  { id: "PENDING", label: "Pending", hint: "Pack and call" },
  { id: "SHIPPED", label: "Shipped", hint: "On the road" },
  { id: "DELIVERED", label: "Delivered", hint: "Collected" },
  { id: "CANCELED", label: "Canceled", hint: "Closed" },
];

export function AdminOrdersTable({
  orders,
  initialStatus,
}: {
  orders: AdminOrderRow[];
  initialStatus?: OrderStatus;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>(initialStatus ?? "all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const next: Record<Filter, number> = {
      all: orders.length,
      PENDING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELED: 0,
    };
    for (const order of orders) next[order.status] += 1;
    return next;
  }, [orders]);

  const pendingTotal = useMemo(
    () =>
      orders
        .filter((order) => order.status === "PENDING")
        .reduce((sum, order) => sum + order.total, 0),
    [orders],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (filter !== "all" && order.status !== filter) return false;
      if (!q) return true;
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.includes(q) ||
        order.governorateName.toLowerCase().includes(q) ||
        order.itemPreview.toLowerCase().includes(q)
      );
    });
  }, [filter, orders, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, AdminOrderRow[]>();
    for (const order of visible) {
      const key = groupOrdersByDay(order.createdAt);
      const list = map.get(key) ?? [];
      list.push(order);
      map.set(key, list);
    }
    return Array.from(map.entries());
  }, [visible]);

  function selectFilter(next: Filter) {
    setFilter(next);
    const url =
      next === "all" ? "/admin/orders" : `/admin/orders?status=${next}`;
    window.history.replaceState(null, "", url);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {FILTERS.filter((item) => item.id !== "all").map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectFilter(item.id)}
            className={`rounded-2xl border bg-white p-4 text-left shadow-[0_1px_2px_rgb(16_24_40_/_0.04)] transition-colors ${
              filter === item.id
                ? "border-primary/40 ring-2 ring-primary/15"
                : "border-border/80 hover:border-primary/25"
            }`}
          >
            <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              {item.label}
            </p>
            <p className="mt-1 font-display text-2xl font-semibold">
              {counts[item.id]}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.id === "PENDING" && counts.PENDING > 0
                ? `${formatIQD(pendingTotal)} to collect`
                : item.hint}
            </p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectFilter(item.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === item.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-white text-foreground/80 ring-1 ring-border hover:bg-muted"
              }`}
            >
              {item.label} · {counts[item.id]}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, phone, order…"
            className="h-10 w-full rounded-xl border border-input bg-white pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </div>

      {grouped.length === 0 ? (
        <AdminPanel className="px-6 py-16 text-center">
          <Package className="mx-auto size-8 text-muted-foreground/70" />
          <p className="mt-3 font-display text-lg font-semibold">No orders here</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {query
              ? "Try a different name, phone, or order number."
              : "New cash-on-delivery orders will land in Pending."}
          </p>
        </AdminPanel>
      ) : (
        <div className="space-y-6">
          {grouped.map(([day, dayOrders]) => (
            <section key={day} className="space-y-2">
              <h2 className="px-1 text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                {day}
              </h2>
              <div className="space-y-2">
                {dayOrders.map((order) => {
                  const wa = whatsappHref(
                    order.customerPhone,
                    orderWhatsAppText(order.orderNumber, order.customerName),
                  );
                  return (
                    <article
                      key={order.id}
                      role="link"
                      tabIndex={0}
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          router.push(`/admin/orders/${order.id}`);
                        }
                      }}
                      className="cursor-pointer rounded-2xl border border-border/80 bg-white p-4 shadow-[0_1px_2px_rgb(16_24_40_/_0.04)] transition-colors hover:border-primary/25 hover:bg-[#fafbff]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-[#eef1f6]">
                            {order.itemImageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={order.itemImageUrl}
                                alt=""
                                className="size-12 object-cover"
                              />
                            ) : (
                              <Package className="absolute inset-0 m-auto size-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-display font-semibold">
                                {order.orderNumber}
                              </p>
                              {!order.isSeenByAdmin ? (
                                <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                  New
                                </span>
                              ) : null}
                              <OrderStatusBadge status={order.status} />
                            </div>
                            <p className="mt-0.5 text-sm text-foreground">
                              {order.customerName}
                              <span className="text-muted-foreground">
                                {" "}
                                · {order.customerPhone}
                              </span>
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="size-3.5 shrink-0" />
                              <span className="truncate">
                                {order.governorateName} · {order.addressLine}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-lg font-semibold tabular-nums">
                            {formatIQD(order.total)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            COD · {formatAdminDate(order.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3">
                        <p className="text-sm text-muted-foreground">
                          {order.itemCount}{" "}
                          {order.itemCount === 1 ? "item" : "items"} ·{" "}
                          {order.itemPreview}
                          {order.notes ? " · Has note" : ""}
                        </p>
                        <div className="flex items-center gap-2">
                          {wa ? (
                            <a
                              href={wa}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(event) => event.stopPropagation()}
                              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-white px-3 text-xs font-medium hover:bg-muted"
                            >
                              <MessageCircle className="size-3.5" />
                              WhatsApp
                            </a>
                          ) : null}
                          <Link
                            href={`/admin/orders/${order.id}`}
                            onClick={(event) => event.stopPropagation()}
                            className="inline-flex h-9 items-center rounded-xl bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                          >
                            Open ticket
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
