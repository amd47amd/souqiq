import type { Role } from "@/types";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    phone: string;
    role: Role;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      phone: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    phone: string;
    role: Role;
  }
}

export {};
