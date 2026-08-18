import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { PageLoader } from "@/components/layout/page-loader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa] lg:flex-row">
      <AdminSidebar adminName={session.user.name} />
      <div className="flex-1 overflow-x-hidden">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Suspense fallback={<PageLoader variant="admin" />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
