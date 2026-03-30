import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { progress: { orderBy: { createdAt: "desc" } } },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ progress: user.progress });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { category, itemId, status } = await request.json();
  if (!category || !itemId) {
    return NextResponse.json(
      { error: "Category and itemId are required" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const progress = await prisma.progress.upsert({
    where: {
      userId_category_itemId: {
        userId: user.id,
        category,
        itemId,
      },
    },
    update: {
      status: status ?? undefined,
      completedAt: status === "completed" ? new Date() : null,
    },
    create: {
      userId: user.id,
      category,
      itemId,
      status: status ?? "started",
    },
  });

  return NextResponse.json(progress);
}
