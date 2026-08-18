import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { getAdminCategoryList } from "@/lib/admin-data";
import { upsertCategoryAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AdminPageHeader,
  AdminPanel,
} from "@/components/admin/admin-ui";

export const metadata: Metadata = {
  title: "Admin Categories",
};

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await getAdminCategoryList();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description="How products are grouped on the storefront."
      />

      <AdminPanel className="p-5">
        <form action={upsertCategoryAction} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <h2 className="font-display text-base font-semibold sm:col-span-2 lg:col-span-4">
            New category
          </h2>
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required placeholder="Perfumes" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" required placeholder="perfumes" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sortOrder">Order</Label>
            <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} />
          </div>
          <div className="flex items-end gap-3">
            <label className="inline-flex h-10 items-center gap-2 text-sm">
              <input type="checkbox" name="isActive" defaultChecked />
              Live
            </label>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </AdminPanel>

      <div className="space-y-2">
        {categories.map((category) => (
          <AdminPanel key={category.id} className="p-4">
            <form
              action={upsertCategoryAction}
              className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto_auto_auto]"
            >
              <input type="hidden" name="id" value={category.id} />
              <input type="hidden" name="description" value={category.description ?? ""} />
              <input type="hidden" name="imageUrl" value={category.imageUrl ?? ""} />
              <input type="hidden" name="sortOrder" value={category.sortOrder} />
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input name="name" defaultValue={category.name} required />
              </div>
              <div className="space-y-1.5">
                <Label>Slug</Label>
                <Input name="slug" defaultValue={category.slug} required />
              </div>
              <p className="pb-2 text-sm text-muted-foreground">
                {category._count.products} products
              </p>
              <label className="inline-flex items-center gap-2 pb-2 text-sm">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={category.isActive}
                />
                Live
              </label>
              <Button type="submit" variant="outline" size="sm" className="mb-0.5">
                Save
              </Button>
            </form>
          </AdminPanel>
        ))}
      </div>
    </div>
  );
}
