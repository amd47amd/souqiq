/** Client-safe product shapes (no Prisma / Node imports). */

export type PurchaseProduct = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  compareAtPrice: number | null;
  hasVariants: boolean;
  category: { name: string; slug: string };
  images: { id: string; url: string; alt: string | null }[];
  options: {
    id: string;
    name: string;
    values: { id: string; value: string }[];
  }[];
  variants: {
    id: string;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    isDefault: boolean;
    optionValues: {
      optionValue: {
        id: string;
        value: string;
        option: { name: string };
      };
    }[];
  }[];
};

export function buildVariantLabel(
  variant: PurchaseProduct["variants"][number],
): string | undefined {
  if (!variant.optionValues.length) return undefined;
  return variant.optionValues
    .map(
      (ov) => `${ov.optionValue.option.name}: ${ov.optionValue.value}`,
    )
    .join(" · ");
}
