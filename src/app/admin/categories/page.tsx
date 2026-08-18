import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { getAdminCategoryList } from "@/lib/admin-data";
import { upsertCategoryAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Admin Categories",
};

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await getAdminCategoryList();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Categories
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Organize the storefront catalog.
        </p>
      </div>

      <form
        action={upsertCategoryAction}
        className="grid gap-4 rounded-xl border border-border bg-white p-5 shadow-sm sm:grid-cols-2"
      >
        <h2 className="font-display text-lg font-semibold sm:col-span-2">
          Add category
        </h2>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" required placeholder="home-appliances" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" name="imageUrl" type="url" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} />
        </div>
        <label className="inline-flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" name="isActive" defaultChecked />
          Active
        </label>
        <div className="sm:col-span-2">
          <Button type="submit">Create category</Button>
        </div>
      </form>

      <div className="space-y-4">
        {categories.map((category) => (
          <form
            key={category.id}
            action={upsertCategoryAction}
            className="grid gap-3 rounded-xl border border-border bg-white p-5 shadow-sm sm:grid-cols-2"
          >
            <input type="hidden" name="id" value={category.id} />
            <div className="space-y-2">
              <Label>Name</Label>
              <Input name="name" defaultValue={category.name} required />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input name="slug" defaultValue={category.slug} required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description</Label>
              <Input
                name="description"
                defaultValue={category.description ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input name="imageUrl" defaultValue={category.imageUrl ?? ""} />
            </div>
            <div className="space-y-2">
              <Label>Sort order</Label>
              <Input
                name="sortOrder"
                type="number"
                defaultValue={category.sortOrder}
              />
            </div>
            <div className="flex items-center justify-between gap-3 sm:col-span-2">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={category.isActive}
                />
                Active · {category._count.products} products
              </label>
              <Button type="submit" variant="outline">
                Save
              </Button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
