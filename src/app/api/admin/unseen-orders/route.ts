import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ count: 0 }, { status: 401 });
  }

  const count = await prisma.order.count({
    where: { isSeenByAdmin: false },
  });

  return NextResponse.json({ count });
}
