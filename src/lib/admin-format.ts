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

export function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8) return null;
  const intl = digits.startsWith("964")
    ? digits
    : digits.startsWith("0")
      ? `964${digits.slice(1)}`
      : `964${digits}`;
  return `https://wa.me/${intl}`;
}
