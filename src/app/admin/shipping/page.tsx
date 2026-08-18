import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { getAdminShippingList } from "@/lib/admin-data";
import { formatIQD } from "@/lib/utils";
import { updateGovernorateFeeAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AdminPageHeader,
  AdminPanel,
  AdminTable,
  AdminTh,
} from "@/components/admin/admin-ui";

export const metadata: Metadata = {
  title: "Admin Shipping",
};

export default async function AdminShippingPage() {
  await requireAdmin();
  const governorates = await getAdminShippingList();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Shipping"
        description="Delivery fee shown at checkout for each governorate."
      />

      <AdminPanel>
        <AdminTable>
          <thead className="border-b border-border/80 bg-[#f8f9fb]">
            <tr>
              <AdminTh>Governorate</AdminTh>
              <AdminTh>Fee (IQD)</AdminTh>
              <AdminTh>Available</AdminTh>
              <AdminTh> </AdminTh>
            </tr>
          </thead>
          <tbody>
            {governorates.map((g) => (
              <tr
                key={g.id}
                className="border-b border-border/70 last:border-0 hover:bg-[#fafbff]"
              >
                <td className="px-4 py-3">
                  <p className="font-medium">{g.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatIQD(g.shippingFee)}
                  </p>
                </td>
                <td className="px-4 py-3" colSpan={3}>
                  <form
                    action={updateGovernorateFeeAction}
                    className="flex flex-wrap items-center gap-3"
                  >
                    <input type="hidden" name="id" value={g.id} />
                    <Input
                      name="shippingFee"
                      type="number"
                      min={0}
                      defaultValue={g.shippingFee}
                      className="w-32"
                    />
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="isActive"
                        defaultChecked={g.isActive}
                      />
                      Available
                    </label>
                    <Button type="submit" size="sm" variant="outline">
                      Save
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </AdminPanel>
    </div>
  );
}
