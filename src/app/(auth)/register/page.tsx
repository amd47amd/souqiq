import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function RegisterPage() {
  return (
    <PageTransition>
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-14">
        <div className="mb-8">
          <p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">
            Join SouqIQ
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Create account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Register with your phone number — no email required.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <RegisterForm />
        </div>
      </div>
    </PageTransition>
  );
}
