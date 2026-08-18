import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Keep recently opened admin (and shop) pages in the client router
    // so going back to Products / Orders does not wait on the server again.
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Cap srcset so phones / 2x desktops never pull 2K–4K files.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pzzgwjpmziqwxfbcqycm.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
