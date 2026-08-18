export type ProductSpec = { label: string; value: string };

const MAX_IMAGES = 12;
const MAX_HIGHLIGHTS = 10;
const MAX_SPECS = 16;

export function parseImageUrls(value: unknown, max = MAX_IMAGES): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item ?? "").trim())
    .filter((url) => /^https?:\/\//i.test(url))
    .slice(0, max);
}

export function parseStringList(value: unknown, max = MAX_HIGHLIGHTS): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .slice(0, max);
}

export function parseProductSpecs(value: unknown, max = MAX_SPECS): ProductSpec[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as { label?: unknown; value?: unknown };
      const label = String(row.label ?? "").trim();
      const specValue = String(row.value ?? "").trim();
      if (!label || !specValue) return null;
      return { label, value: specValue };
    })
    .filter((row): row is ProductSpec => row !== null)
    .slice(0, max);
}
