/**
 * Adds extra gallery images to a few demo products (no full reseed).
 * Run: npx tsx scripts/add-gallery-images.ts
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL })),
});

const UPDATES: { slug: string; urls: string[] }[] = [
  {
    slug: "discovery-set-5x10ml",
    urls: [
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=1200&q=80",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&q=80",
    ],
  },
  {
    slug: "santal-blanc-75ml",
    urls: [
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1200&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&q=80",
      "https://images.unsplash.com/photo-1547887538-44774d369162?w=1200&q=80",
    ],
  },
];

async function main() {
  for (const item of UPDATES) {
    const product = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (!product) {
      console.log(`skip missing: ${item.slug}`);
      continue;
    }

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: item.urls.map((url, sortOrder) => ({
        productId: product.id,
        url,
        alt: product.name,
        sortOrder,
      })),
    });
    console.log(`updated ${item.slug} → ${item.urls.length} images`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
