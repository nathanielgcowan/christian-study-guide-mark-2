import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const emailPrefs = await prisma.emailPreference.findUnique({
    where: { userId: user.id },
  });

  return NextResponse.json({ emailPrefs: emailPrefs || {} });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { dailyDevotional, prayerUpdates, newsletter } = await request.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const emailPrefs = await prisma.emailPreference.upsert({
    where: { userId: user.id },
    update: {
      dailyDevotional: dailyDevotional ?? undefined,
      prayerUpdates: prayerUpdates ?? undefined,
      newsletter: newsletter ?? undefined,
    },
    create: {
      userId: user.id,
      dailyDevotional: dailyDevotional ?? false,
      prayerUpdates: prayerUpdates ?? false,
      newsletter: newsletter ?? false,
    },
  });

  return NextResponse.json(emailPrefs);
}
