/**
 * Serve Unsplash / Supabase Storage from their CDNs.
 * Avoids Vercel /_next/image proxy hops (slow from Middle East → US East).
 * Always cap width so a 100vw hero never requests a 3840px file.
 */
const MAX_WIDTH = 1600;

export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const w = Math.min(Math.max(1, width), MAX_WIDTH);
  const q = quality ?? 70;

  try {
    const url = new URL(src);
    if (
      url.hostname === "images.unsplash.com" ||
      url.hostname === "plus.unsplash.com"
    ) {
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      url.searchParams.set("w", String(w));
      url.searchParams.set("q", String(q));
      return url.toString();
    }

    if (url.hostname.endsWith(".supabase.co")) {
      // Serve from Storage CDN as-is. Resize happens on upload (see product-form).
      return src;
    }
  } catch {
    // fall through
  }
  return src;
}
