"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Archive, Eye, EyeOff, Pencil, Search } from "lucide-react";
import { formatIQD } from "@/lib/utils";
import {
  deleteProductAction,
  toggleProductActiveAction,
} from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { AdminPanel, AdminTable, AdminTh, Pill } from "@/components/admin/admin-ui";

export type AdminProductRow = {
  id: string;
  name: string;
  basePrice: number;
  hasVariants: boolean;
  isActive: boolean;
  categoryName: string;
  imageUrl: string | null;
  stock: number;
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

export function AdminProductsTable({ products }: { products: AdminProductRow[] }) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.categoryName.toLowerCase().includes(q),
    );
  }, [products, query]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products…"
          className="h-10 w-full rounded-xl border border-input bg-white pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>

      <AdminPanel>
        <AdminTable>
          <thead className="border-b border-border/80 bg-[#f8f9fb]">
            <tr>
              <AdminTh>Product</AdminTh>
              <AdminTh className="hidden md:table-cell">Category</AdminTh>
              <AdminTh>Price</AdminTh>
              <AdminTh className="hidden sm:table-cell">Stock</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh className="text-right"> </AdminTh>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-14 text-center text-sm text-muted-foreground"
                >
                  No products match that search.
                </td>
              </tr>
            )}
            {visible.map((product) => (
              <tr
                key={product.id}
                className="border-b border-border/70 last:border-0 hover:bg-[#fafbff]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-11 overflow-hidden rounded-lg bg-muted">
                      {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumbSrc(product.imageUrl)}
                          alt=""
                          width={44}
                          height={44}
                          className="size-11 object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="block truncate font-medium hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      {product.hasVariants ? (
                        <p className="text-xs text-muted-foreground">Variants</p>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {product.categoryName}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {formatIQD(product.basePrice)}
                </td>
                <td className="hidden px-4 py-3 tabular-nums sm:table-cell">
                  {product.stock}
                </td>
                <td className="px-4 py-3">
                  <Pill tone={product.isActive ? "success" : "muted"}>
                    {product.isActive ? "Live" : "Hidden"}
                  </Pill>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon" className="size-8">
                      <Link href={`/admin/products/${product.id}`} aria-label="Edit">
                        <Pencil className="size-3.5" />
                      </Link>
                    </Button>
                    <form action={toggleProductActiveAction}>
                      <input type="hidden" name="productId" value={product.id} />
                      <input
                        type="hidden"
                        name="isActive"
                        value={String(product.isActive)}
                      />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label={product.isActive ? "Hide" : "Show"}
                      >
                        {product.isActive ? (
                          <EyeOff className="size-3.5" />
                        ) : (
                          <Eye className="size-3.5" />
                        )}
                      </Button>
                    </form>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="productId" value={product.id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        aria-label="Archive"
                      >
                        <Archive className="size-3.5" />
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </AdminPanel>
    </div>
  );
}
