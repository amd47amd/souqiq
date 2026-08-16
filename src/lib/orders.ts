import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

async function fetchActiveGovernorates() {
  return prisma.governorate.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      shippingFee: true,
    },
  });
}

export const getActiveGovernorates = unstable_cache(
  fetchActiveGovernorates,
  ["shop-governorates"],
  { revalidate: 300, tags: ["governorates"] },
);

/** SQ-YYYYMMDD-XXXX */
export function generateOrderNumber() {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `SQ-${date}-${suffix}`;
}
