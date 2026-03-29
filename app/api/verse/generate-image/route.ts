import { NextResponse } from "next/server";
import { generateVerseImage } from "@/lib/verse-image";

export async function POST(request: Request) {
  try {
    const { verse, reference, backgroundColor, textColor } =
      await request.json();

    if (!verse || !reference) {
      return NextResponse.json(
        { error: "Verse and reference are required" },
        { status: 400 },
      );
    }

    const imageBuffer = await generateVerseImage({
      verse,
      reference,
      backgroundColor: backgroundColor || "#1f2937",
      textColor: textColor || "#ffffff",
      width: 1200,
      height: 630,
    });

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
        "Content-Disposition": `attachment; filename="verse-${Date.now()}.png"`,
      },
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  }
}
