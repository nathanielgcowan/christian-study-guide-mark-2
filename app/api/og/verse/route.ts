import { generateVerseImage } from "@/lib/verse-image";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const verse = searchParams.get("verse") || "For God so loved the world...";
  const reference = searchParams.get("reference") || "John 3:16";
  const backgroundColor = searchParams.get("bg") || "#1f2937";
  const textColor = searchParams.get("text") || "#ffffff";

  try {
    const imageBuffer = await generateVerseImage({
      verse,
      reference,
      backgroundColor,
      textColor,
      width: 1200,
      height: 630,
    });

    return new NextResponse(Uint8Array.from(imageBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error generating verse image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  }
}
