import { NextResponse } from "next/server";
import { getDailyDevotional } from "@/lib/devotionals";

export async function GET() {
  const today = new Date().toISOString().split("T")[0];
  const devotional = getDailyDevotional(today);

  if (!devotional) {
    return NextResponse.json({ devotional: null });
  }

  return NextResponse.json({ devotional });
}
