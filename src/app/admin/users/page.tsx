import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { getAdminUserList } from "@/lib/admin-data";
import { updateUserAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Users",
};

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await getAdminUserList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Users
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage customer and admin accounts.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium">Save</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.phone}</p>
                </td>
                <td className="px-4 py-3">{user._count.orders}</td>
                <td className="px-4 py-3" colSpan={3}>
                  <form
                    action={updateUserAction}
                    className="flex flex-wrap items-center gap-3"
                  >
                    <input type="hidden" name="userId" value={user.id} />
                    <select
                      name="role"
                      defaultValue={user.role}
                      className="h-9 rounded-md border border-input bg-white px-2 text-sm"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
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
