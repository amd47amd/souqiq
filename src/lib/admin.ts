import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const requireAdmin = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }
  return session;
});
