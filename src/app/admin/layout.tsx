import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const unseenOrders = await prisma.order.count({
    where: { isSeenByAdmin: false },
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa] lg:flex-row">
      <AdminSidebar
        adminName={session.user.name}
        unseenOrders={unseenOrders}
      />
      <div className="flex-1 overflow-x-hidden">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
