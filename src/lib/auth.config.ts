import type { NextAuthConfig } from "next-auth";
import type { Role } from "@/types";

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.phone = (user as { phone: string }).phone;
        token.role = (user as { role: Role }).role;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        name: (token.name as string) ?? "",
        phone: token.phone as string,
        role: token.role as Role,
      };
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
