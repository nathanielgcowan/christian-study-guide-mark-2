import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const events = await prisma.analyticsEvent.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const metricsByUser = events.reduce<
    Record<
      string,
      { lastActive: string; sessions: number; prayers: number; pages: number }
    >
  >((acc, event) => {
    const email = event.user.email;
    const existing = acc[email] || {
      lastActive: "",
      sessions: 0,
      prayers: 0,
      pages: 0,
    };

    if (event.createdAt.toISOString() > existing.lastActive) {
      existing.lastActive = event.createdAt.toISOString();
    }

    if (event.type === "session") existing.sessions += 1;
    if (event.type === "prayer") existing.prayers += 1;
    if (event.type === "page") existing.pages += 1;

    acc[email] = existing;
    return acc;
  }, {});

  const metrics = Object.entries(metricsByUser).map(([email, data], idx) => ({
    id: idx + 1,
    email,
    lastActive: data.lastActive,
    sessions: data.sessions,
    prayersLogged: data.prayers,
    pagesVisited: data.pages,
  }));

  return NextResponse.json({ metrics });
}
