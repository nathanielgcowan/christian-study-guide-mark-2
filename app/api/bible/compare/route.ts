import { NextResponse } from "next/server";
import { getVerseComparison } from "@/lib/bible";

export async function POST(request: Request) {
  const {
    reference,
    translations,
  }: { reference?: string; translations?: string[] } = await request.json();

  if (!reference) {
    return NextResponse.json(
      { error: "Reference is required" },
      { status: 400 },
    );
  }

  const requestedTranslations =
    translations && translations.length > 0 ? translations : ["web", "kjv", "asv"];

  const results = await getVerseComparison(reference, requestedTranslations);
  return NextResponse.json({ results });
}
