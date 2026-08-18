import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getAdminProductList } from "@/lib/admin-data";
import { formatIQD } from "@/lib/utils";
import {
  deleteProductAction,
  toggleProductActiveAction,
} from "@/actions/admin";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Products",
};

function thumbSrc(src: string) {
  try {
    const url = new URL(src);
    if (
      url.hostname === "images.unsplash.com" ||
      url.hostname === "plus.unsplash.com"
    ) {
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      url.searchParams.set("w", "96");
      url.searchParams.set("q", "50");
      return url.toString();
    }
  } catch {
    // keep original
  }
  return src;
}

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getAdminProductList();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} products in catalog
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                Category
              </th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">
                Stock
              </th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 overflow-hidden rounded-md bg-muted">
                      {product.imageUrl ? (
                        // Native img avoids /_next/image work for dozens of thumbs.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumbSrc(product.imageUrl)}
                          alt=""
                          width={48}
                          height={48}
                          className="size-12 object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {product.hasVariants ? "Has variants" : "Simple SKU"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  {product.categoryName}
                </td>
                <td className="px-4 py-3">{formatIQD(product.basePrice)}</td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  {product.stock}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      product.isActive
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {product.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/products/${product.id}`}>Edit</Link>
                    </Button>
                    <form action={toggleProductActiveAction}>
                      <input type="hidden" name="productId" value={product.id} />
                      <input
                        type="hidden"
                        name="isActive"
                        value={String(product.isActive)}
                      />
                      <Button type="submit" variant="ghost" size="sm">
                        {product.isActive ? "Hide" : "Show"}
                      </Button>
                    </form>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="productId" value={product.id} />
                      <Button type="submit" variant="ghost" size="sm">
                        Archive
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
