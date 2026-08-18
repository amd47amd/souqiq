"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatIQD } from "@/lib/utils";
import { ORDER_STATUSES } from "@/types";
import type { OrderStatus } from "@/types";

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
    <>
      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={filter === "all"}
          label="All"
          onClick={() => selectFilter("all")}
        />
        {ORDER_STATUSES.map((status) => (
          <FilterChip
            key={status}
            active={filter === status}
            label={status}
            onClick={() => selectFilter(status)}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                Governorate
              </th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No orders found.
                </td>
              </tr>
            )}
            {visible.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                  {!order.isSeenByAdmin && (
                    <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                      NEW
                    </span>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("en-GB")}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p>{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.customerPhone}
                  </p>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  {order.governorateName}
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatIQD(order.total)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
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
          ? "bg-primary text-primary-foreground"
          : "bg-white text-foreground ring-1 ring-border hover:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    PENDING: "bg-amber-50 text-amber-800 ring-amber-200",
    SHIPPED: "bg-blue-50 text-blue-800 ring-blue-200",
    DELIVERED: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    CANCELED: "bg-red-50 text-red-800 ring-red-200",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${styles[status]}`}
    >
      {status}
    </span>
  );
}
