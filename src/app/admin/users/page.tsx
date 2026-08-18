import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { getAdminUserList } from "@/lib/admin-data";
import { updateUserAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import {
  AdminPageHeader,
  AdminPanel,
  AdminTable,
  AdminTh,
} from "@/components/admin/admin-ui";

export const metadata: Metadata = {
  title: "Admin Customers",
};

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await getAdminUserList();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customers"
        description="Accounts that can place COD orders."
      />

      <AdminPanel>
        <AdminTable>
          <thead className="border-b border-border/80 bg-[#f8f9fb]">
            <tr>
              <AdminTh>Customer</AdminTh>
              <AdminTh>Orders</AdminTh>
              <AdminTh>Role</AdminTh>
              <AdminTh>Access</AdminTh>
              <AdminTh> </AdminTh>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border/70 last:border-0 hover:bg-[#fafbff]"
              >
                <td className="px-4 py-3">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.phone}</p>
                </td>
                <td className="px-4 py-3 tabular-nums">{user._count.orders}</td>
                <td className="px-4 py-3" colSpan={3}>
                  <form
                    action={updateUserAction}
                    className="flex flex-wrap items-center gap-3"
                  >
                    <input type="hidden" name="userId" value={user.id} />
                    <select
                      name="role"
                      defaultValue={user.role}
                      className="h-9 rounded-lg border border-input bg-white px-2 text-sm"
                    >
                      <option value="USER">Customer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="isActive"
                        defaultChecked={user.isActive}
                      />
                      Active
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
