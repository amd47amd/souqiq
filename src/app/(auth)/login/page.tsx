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
          <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
            Welcome back
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Sign in
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Use your Iraqi mobile number and password to continue.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-border/80 bg-white p-6 shadow-[0_18px_50px_-36px_rgba(18,21,26,0.45)] sm:p-8">
          <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-muted" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </PageTransition>
  );
}
