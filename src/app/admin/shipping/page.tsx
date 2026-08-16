import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatIQD } from "@/lib/utils";
import { updateGovernorateFeeAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Admin Shipping",
};

export default async function AdminShippingPage() {
  await requireAdmin();
  const governorates = await prisma.governorate.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Shipping fees
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dummy rates for all Iraqi governorates — update anytime.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Governorate</th>
              <th className="px-4 py-3 font-medium">Fee (IQD)</th>
              <th className="px-4 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium">Save</th>
            </tr>
          </thead>
          <tbody>
            {governorates.map((g) => (
              <tr key={g.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{g.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Current: {formatIQD(g.shippingFee)}
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
                      className="w-36"
                    />
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="isActive"
                        defaultChecked={g.isActive}
                      />
                      Active
                    </label>
                    <Button type="submit" size="sm" variant="outline">
                      Update
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
