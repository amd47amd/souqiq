import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const [
    users,
    admins,
    governorates,
    categories,
    products,
    withVariants,
    withoutVariants,
    variants,
    featured,
    trending,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.governorate.count(),
    prisma.category.count(),
    prisma.product.count(),
    prisma.product.count({ where: { hasVariants: true } }),
    prisma.product.count({ where: { hasVariants: false } }),
    prisma.productVariant.count(),
    prisma.product.count({ where: { isFeatured: true } }),
    prisma.product.count({ where: { isTrending: true } }),
  ]);

  const byCategory = await prisma.category.findMany({
    select: {
      name: true,
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  const sampleVariant = await prisma.product.findFirst({
    where: { hasVariants: true },
    include: {
      options: { include: { values: true } },
      variants: { take: 3 },
    },
  });
  const sampleSimple = await prisma.product.findFirst({
    where: { hasVariants: false },
    include: { variants: true },
  });

  console.log(
    JSON.stringify(
      {
        users,
        admins,
        adminPhone: admin?.phone,
        governorates,
        categories,
        products,
        withVariants,
        withoutVariants,
        variants,
        featured,
        trending,
        byCategory,
        sampleVariant: sampleVariant && {
          name: sampleVariant.name,
          options: sampleVariant.options.map((o) => ({
            name: o.name,
            values: o.values.map((v) => v.value),
          })),
          variantCount: sampleVariant.variants.length,
        },
        sampleSimple: sampleSimple && {
          name: sampleSimple.name,
          defaultSku: sampleSimple.variants[0]?.sku,
          stock: sampleSimple.variants[0]?.stock,
        },
      },
      null,
      2,
    ),
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
