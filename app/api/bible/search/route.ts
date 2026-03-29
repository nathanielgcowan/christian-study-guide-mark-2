import { NextResponse } from "next/server";
import { searchVerse } from "@lib/bible";

export async function POST(req: Request) {
  const { query } = await req.json();
  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }
  const results = await searchVerse(query);
  return NextResponse.json({ results });
}
