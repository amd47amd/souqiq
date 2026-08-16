/**
 * Serve Unsplash (and other remotes) directly from their CDN.
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
  } catch {
    // fall through
  }
  return src;
}
