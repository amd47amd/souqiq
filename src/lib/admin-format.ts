import type { OrderStatus } from "@/types";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pending",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELED: "Canceled",
};

export function formatAdminDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function whatsappHref(phone: string, text?: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8) return null;
  const intl = digits.startsWith("964")
    ? digits
    : digits.startsWith("0")
      ? `964${digits.slice(1)}`
      : `964${digits}`;
  const base = `https://wa.me/${intl}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function orderWhatsAppText(orderNumber: string, customerName: string) {
  return `Hello ${customerName}, this is SouqIQ regarding order ${orderNumber}.`;
}

export function groupOrdersByDay(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startThat = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.round(
    (startToday.getTime() - startThat.getTime()) / 86_400_000,
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
