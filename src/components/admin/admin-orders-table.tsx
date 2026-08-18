"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatIQD } from "@/lib/utils";
import { formatAdminDate, ORDER_STATUS_LABEL, whatsappHref } from "@/lib/admin-format";
import { ORDER_STATUSES } from "@/types";
import type { OrderStatus } from "@/types";
import {
  AdminPanel,
  AdminTable,
  AdminTh,
  OrderStatusBadge,
} from "@/components/admin/admin-ui";

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
};

type Filter = "all" | OrderStatus;

export function AdminOrdersTable({
  orders,
  initialStatus,
}: {
  orders: AdminOrderRow[];
  initialStatus?: OrderStatus;
}) {
  const [filter, setFilter] = useState<Filter>(initialStatus ?? "all");

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

  const visible = useMemo(
    () =>
      filter === "all" ? orders : orders.filter((order) => order.status === filter),
    [filter, orders],
  );

  function selectFilter(next: Filter) {
    setFilter(next);
    const url =
      next === "all" ? "/admin/orders" : `/admin/orders?status=${next}`;
    window.history.replaceState(null, "", url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        <FilterChip
          active={filter === "all"}
          label={`All · ${counts.all}`}
          onClick={() => selectFilter("all")}
        />
        {ORDER_STATUSES.map((status) => (
          <FilterChip
            key={status}
            active={filter === status}
            label={`${ORDER_STATUS_LABEL[status]} · ${counts[status]}`}
            onClick={() => selectFilter(status)}
          />
        ))}
      </div>

      <AdminPanel>
        <AdminTable>
          <thead className="border-b border-border/80 bg-[#f8f9fb]">
            <tr>
              <AdminTh>Order</AdminTh>
              <AdminTh>Customer</AdminTh>
              <AdminTh className="hidden md:table-cell">City</AdminTh>
              <AdminTh>Total</AdminTh>
              <AdminTh>Status</AdminTh>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-14 text-center text-sm text-muted-foreground"
                >
                  No orders in this view.
                </td>
              </tr>
            )}
            {visible.map((order) => {
              const wa = whatsappHref(order.customerPhone);
              return (
                <tr
                  key={order.id}
                  className="border-b border-border/70 last:border-0 hover:bg-[#fafbff]"
                >
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {order.orderNumber}
                    </Link>
                    {!order.isSeenByAdmin && (
                      <span className="ml-2 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                        New
                      </span>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatAdminDate(order.createdAt)}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium">{order.customerName}</p>
                    {wa ? (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary"
                      >
                        {order.customerPhone}
                      </a>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {order.customerPhone}
                      </p>
                    )}
                  </td>
                  <td className="hidden px-4 py-3.5 md:table-cell">
                    {order.governorateName}
                  </td>
                  <td className="px-4 py-3.5 font-medium tabular-nums">
                    {formatIQD(order.total)}
                  </td>
                  <td className="px-4 py-3.5">
                    <OrderStatusBadge status={order.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </AdminTable>
      </AdminPanel>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-white text-foreground/80 ring-1 ring-border hover:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}
