import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/actions/auth";
import { PageTransition } from "@/components/layout/page-transition";
import { PageIntro } from "@/components/layout/page-intro";
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
        <PageIntro
          eyebrow="Profile"
          title="My account"
          description="Your SouqIQ details for checkout and order updates."
        />

        <div className="space-y-5 rounded-[1.5rem] border border-border/80 bg-white p-6 shadow-[0_18px_50px_-36px_rgba(18,21,26,0.45)] sm:p-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Name
            </p>
            <p className="mt-1.5 font-display text-lg font-semibold">{user.name}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Phone
            </p>
            <p className="mt-1.5 font-medium">{formatPhoneDisplay(user.phone)}</p>
          </div>
          {user.role === "ADMIN" ? (
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Role
              </p>
              <p className="mt-1.5 font-medium">Admin</p>
            </div>
          ) : null}

          <form action={logoutAction} className="pt-2">
            <Button type="submit" variant="outline" className="w-full rounded-full">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
