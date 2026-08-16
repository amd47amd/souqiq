import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isCheckoutOrAccount =
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/") ||
    pathname === "/account" ||
    pathname.startsWith("/account/");
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if ((isCheckoutOrAccount || isAdmin) && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  if (isAuthPage && isLoggedIn) {
    const dest = role === "ADMIN" ? "/admin" : "/";
    return NextResponse.redirect(new URL(dest, req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/checkout",
    "/checkout/:path*",
    "/account",
    "/account/:path*",
    "/admin",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
