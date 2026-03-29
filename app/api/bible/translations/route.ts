import { NextResponse } from "next/server";

const BIBLE_API_URL = "https://api.scripture.api.bible/v1";
const API_KEY = process.env.BIBLE_API_KEY || "";

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json({ error: "No API key" }, { status: 400 });
  }
  const res = await fetch(`${BIBLE_API_URL}/bibles`, {
    headers: { "api-key": API_KEY },
  });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch translations" },
      { status: 500 },
    );
  }
  const data = await res.json();
  return NextResponse.json({ translations: data.data || [] });
}
