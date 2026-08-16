import type { Metadata } from "next";
import { Suspense } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <PageTransition>
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-14">
        <div className="mb-8">
          <p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">
            Welcome back
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use your Iraqi mobile number and password to continue.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-muted" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </PageTransition>
  );
}
