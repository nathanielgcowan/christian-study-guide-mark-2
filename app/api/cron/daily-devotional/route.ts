import { NextResponse } from "next/server";
import { sendDailyDevotionals } from "@/lib/cron";

const CRON_SECRET = process.env.CRON_SECRET || "";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const count = await sendDailyDevotionals();
  return NextResponse.json({
    success: true,
    message: `Sent devotionals to ${count} users`,
  });
}
