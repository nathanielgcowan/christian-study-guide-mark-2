import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

const MOCK_METRICS = [
  {
    id: 1,
    email: "alice@example.com",
    lastActive: "2026-03-27 19:18",
    sessions: 17,
    prayersLogged: 7,
    pagesVisited: 53,
  },
  {
    id: 2,
    email: "ben@example.com",
    lastActive: "2026-03-28 06:08",
    sessions: 24,
    prayersLogged: 14,
    pagesVisited: 81,
  },
  {
    id: 3,
    email: "carla@example.com",
    lastActive: "2026-03-28 08:43",
    sessions: 9,
    prayersLogged: 3,
    pagesVisited: 27,
  },
];

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.json({ metrics: MOCK_METRICS });
}
