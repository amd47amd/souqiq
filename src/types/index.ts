export const IRAQI_GOVERNORATES = [
  "Baghdad",
  "Basra",
  "Nineveh",
  "Erbil",
  "Sulaymaniyah",
  "Duhok",
  "Kirkuk",
  "Najaf",
  "Karbala",
  "Babil",
  "Wasit",
  "Diyala",
  "Anbar",
  "Maysan",
  "Dhi Qar",
  "Muthanna",
  "Qadisiyyah",
  "Saladin",
] as const;

export type IraqiGovernorate = (typeof IRAQI_GOVERNORATES)[number];

export const ORDER_STATUSES = [
  "PENDING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = ["COD"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const USER_ROLES = ["USER", "ADMIN"] as const;
export type Role = (typeof USER_ROLES)[number];
