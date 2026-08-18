"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, MessageCircle, Package, Search } from "lucide-react";
import { formatIQD } from "@/lib/utils";
import {
  formatAdminDate,
  groupOrdersByDay,
  orderWhatsAppText,
  whatsappHref,
} from "@/lib/admin-format";
import { updateOrderStatusAction } from "@/actions/admin";
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

const STATUS_CARDS: {
  id: OrderStatus;
  label: string;
  hint: string;
  accent: string;
}[] = [
  {
    id: "PENDING",
    label: "Pending",
    hint: "Ready to pack",
    accent: "bg-amber-400",
  },
  {
    id: "SHIPPED",
    label: "Shipped",
    hint: "With the courier",
    accent: "bg-sky-400",
  },
  {
    id: "DELIVERED",
    label: "Delivered",
    hint: "Cash collected",
    accent: "bg-emerald-400",
  },
  {
    id: "CANCELED",
    label: "Canceled",
    hint: "Closed",
    accent: "bg-rose-400",
  },
];

const RAIL: Record<OrderStatus, string> = {
  PENDING: "bg-amber-400",
  SHIPPED: "bg-sky-400",
  DELIVERED: "bg-emerald-400",
  CANCELED: "bg-rose-300",
};

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
    const next: Record<OrderStatus, number> = {
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

  const visibleTotal = useMemo(
    () => visible.reduce((sum, order) => sum + order.total, 0),
    [visible],
  );

  function selectFilter(next: OrderStatus) {
    const resolved: Filter = filter === next ? "all" : next;
    setFilter(resolved);
    const url =
      resolved === "all" ? "/admin/orders" : `/admin/orders?status=${resolved}`;
    window.history.replaceState(null, "", url);
  }

  const activeCard = STATUS_CARDS.find((item) => item.id === filter);
  const listTitle = activeCard ? `${activeCard.label} orders` : "All orders";

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STATUS_CARDS.map((item) => {
          const selected = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectFilter(item.id)}
              className={`rounded-2xl border bg-white p-4 text-left shadow-[0_1px_2px_rgb(16_24_40_/_0.04)] transition-colors ${
                selected
                  ? "border-primary/40 ring-2 ring-primary/15"
                  : "border-border/80 hover:border-primary/25"
              }`}
            >
              <span className={`mb-3 block h-1 w-8 rounded-full ${item.accent}`} />
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
          );
        })}
      </div>

      <AdminPanel>
        <div className="flex flex-col gap-3 border-b border-border/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <p className="font-display text-base font-semibold">{listTitle}</p>
            <p className="text-sm text-muted-foreground">
              {visible.length} {visible.length === 1 ? "order" : "orders"}
              {visible.length > 0 ? ` · ${formatIQD(visibleTotal)}` : ""}
              {filter !== "all" ? (
                <>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => {
                      setFilter("all");
                      window.history.replaceState(null, "", "/admin/orders");
                    }}
                    className="font-medium text-primary hover:underline"
                  >
                    Show all
                  </button>
                </>
              ) : null}
            </p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, phone, order…"
              className="h-10 w-full rounded-xl border border-input bg-[#f8f9fb] pr-3 pl-9 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </div>

        {grouped.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Package className="mx-auto size-8 text-muted-foreground/70" />
            <p className="mt-3 font-display text-lg font-semibold">No orders here</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {query
                ? "Try a different name, phone, or order number."
                : "New cash-on-delivery orders will land in Pending."}
            </p>
          </div>
        ) : (
          <div>
            {grouped.map(([day, dayOrders]) => (
              <section key={day}>
                <div className="bg-[#f8f9fb] px-5 py-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                  {day}
                </div>
                <ul>
                  {dayOrders.map((order) => {
                    const wa = whatsappHref(
                      order.customerPhone,
                      orderWhatsAppText(order.orderNumber, order.customerName),
                    );
                    return (
                      <li
                        key={order.id}
                        className="border-b border-border/70 last:border-0"
                      >
                        <article
                          role="link"
                          tabIndex={0}
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              router.push(`/admin/orders/${order.id}`);
                            }
                          }}
                          className="relative cursor-pointer px-4 py-4 hover:bg-[#fafbff] sm:px-5"
                        >
                          <span
                            className={`absolute top-4 bottom-4 left-0 w-1 rounded-r-full ${RAIL[order.status]}`}
                          />
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex min-w-0 items-start gap-3.5">
                              <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-[#eef1f6] ring-1 ring-border/60">
                                {order.itemImageUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={order.itemImageUrl}
                                    alt=""
                                    className="size-16 object-cover"
                                  />
                                ) : (
                                  <Package className="absolute inset-0 m-auto size-5 text-muted-foreground" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-display text-[15px] font-semibold">
                                    {order.orderNumber}
                                  </p>
                                  {!order.isSeenByAdmin ? (
                                    <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                      New
                                    </span>
                                  ) : null}
                                  <OrderStatusBadge status={order.status} />
                                </div>
                                <p className="mt-1 text-sm">
                                  {order.customerName}
                                  <span className="text-muted-foreground">
                                    {" "}
                                    · {order.customerPhone}
                                  </span>
                                </p>
                                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="size-3.5 shrink-0" />
                                  <span className="truncate">
                                    {order.governorateName} · {order.addressLine}
                                  </span>
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {order.itemCount}{" "}
                                  {order.itemCount === 1 ? "item" : "items"} ·{" "}
                                  {order.itemPreview}
                                  {order.notes ? " · Note" : ""}
                                </p>
                              </div>
                            </div>

                            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end xl:flex-row">
                              <div className="sm:mr-2 lg:mr-0 xl:mr-4">
                                <p className="font-display text-xl font-semibold tabular-nums">
                                  {formatIQD(order.total)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  COD · {formatAdminDate(order.createdAt)}
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                {order.status === "PENDING" ? (
                                  <QuickStatus
                                    orderId={order.id}
                                    status="SHIPPED"
                                    label="Ship"
                                  />
                                ) : null}
                                {order.status === "SHIPPED" ? (
                                  <QuickStatus
                                    orderId={order.id}
                                    status="DELIVERED"
                                    label="Delivered"
                                  />
                                ) : null}
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
                                  Open
                                </Link>
                              </div>
                            </div>
                          </div>
                        </article>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </AdminPanel>
    </div>
  );
}

function QuickStatus({
  orderId,
  status,
  label,
}: {
  orderId: string;
  status: OrderStatus;
  label: string;
}) {
  return (
    <form
      action={updateOrderStatusAction}
      onClick={(event) => event.stopPropagation()}
    >
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className="inline-flex h-9 items-center rounded-xl border border-border bg-white px-3 text-xs font-medium hover:bg-muted"
      >
        {label}
      </button>
    </form>
  );
}
