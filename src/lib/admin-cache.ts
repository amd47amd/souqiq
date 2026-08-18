/** Shared cache tags for admin list/stats. Keep TTLs short so mutations stay fresh. */
export const ADMIN_CACHE_TAGS = {
  dashboard: "admin-dashboard",
  products: "admin-products",
  orders: "admin-orders",
  users: "admin-users",
  categories: "admin-categories",
  shipping: "admin-shipping",
} as const;

export const ADMIN_LIST_REVALIDATE_SECONDS = 20;
export const ADMIN_DASHBOARD_REVALIDATE_SECONDS = 20;
