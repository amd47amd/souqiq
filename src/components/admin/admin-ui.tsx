import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABEL } from "@/lib/admin-format";
import type { OrderStatus } from "@/types";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-[1.75rem] font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function AdminPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_1px_2px_rgb(16_24_40_/_0.04)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
    </div>
  );
}

export function AdminTh({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    PENDING: "bg-amber-50 text-amber-800 ring-amber-200/80",
    SHIPPED: "bg-sky-50 text-sky-800 ring-sky-200/80",
    DELIVERED: "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
    CANCELED: "bg-rose-50 text-rose-800 ring-rose-200/80",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${styles[status]}`}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

export function Pill({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "success" | "warning";
}) {
  const tones = {
    muted: "bg-muted text-muted-foreground",
    success: "bg-emerald-50 text-emerald-800",
    warning: "bg-amber-50 text-amber-800",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
