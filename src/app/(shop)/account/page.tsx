import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/actions/auth";
import { PageTransition } from "@/components/layout/page-transition";
import { Button } from "@/components/ui/button";
import { formatPhoneDisplay } from "@/lib/phone";

export const metadata: Metadata = {
  title: "My Account",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const { user } = session;

  return (
    <PageTransition>
      <div className="mx-auto max-w-lg px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          My account
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your SouqIQ profile details.
        </p>

        <div className="mt-8 space-y-4 rounded-xl border border-border bg-white p-6">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Name
            </p>
            <p className="mt-1 font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Phone
            </p>
            <p className="mt-1 font-medium">{formatPhoneDisplay(user.phone)}</p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Role
            </p>
            <p className="mt-1 font-medium capitalize">
              {user.role.toLowerCase()}
            </p>
          </div>

          <form action={logoutAction} className="pt-2">
            <Button type="submit" variant="outline" className="w-full">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
