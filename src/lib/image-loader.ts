/**
 * Serve Unsplash / Supabase Storage directly from CDN.
 * Avoids Vercel /_next/image proxy hops (slow from Middle East → US East).
 */
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  try {
    const url = new URL(src);
    if (
      url.hostname === "images.unsplash.com" ||
      url.hostname === "plus.unsplash.com"
    ) {
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      url.searchParams.set("w", String(width));
      url.searchParams.set("q", String(quality ?? 70));
      return url.toString();
    }

    // Supabase public storage URLs — pass through as-is
    if (url.hostname.endsWith(".supabase.co")) {
      return src;
    }
  } catch {
    // fall through
  }
  return src;
}
