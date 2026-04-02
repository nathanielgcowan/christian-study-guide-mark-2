import { NextResponse } from "next/server";
import { findBibleBook, getChapterPassage, getDefaultBibleReference, SUPPORTED_TRANSLATIONS } from "@/lib/bible";

const OPENAI_API_URL = "https://api.openai.com/v1/audio/speech";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedBook = searchParams.get("book") ?? getDefaultBibleReference().book;
  const requestedChapter = Number(
    searchParams.get("chapter") ?? getDefaultBibleReference().chapter,
  );
  const requestedTranslation =
    searchParams.get("translation") ?? getDefaultBibleReference().translation;
  const voice = searchParams.get("voice") ?? process.env.OPENAI_TTS_VOICE ?? "cedar";
  const model = process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts";
  const openAiKey = process.env.OPENAI_API_KEY ?? "";

  if (!openAiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is required for narrated audio." },
      { status: 400 },
    );
  }

  const book = findBibleBook(requestedBook) ?? findBibleBook(getDefaultBibleReference().book);
  if (!book) {
    return NextResponse.json({ error: "Book not found." }, { status: 404 });
  }

  const chapter = Math.min(Math.max(requestedChapter || 1, 1), book.chapters);
  const translation = SUPPORTED_TRANSLATIONS.some(
    (entry) => entry.id === requestedTranslation,
  )
    ? requestedTranslation
    : getDefaultBibleReference().translation;

  const verses = await getChapterPassage(book.name, chapter, translation);
  if (!verses.length) {
    return NextResponse.json({ error: "Chapter text not available." }, { status: 404 });
  }

  const chapterNarration = verses
    .map((verse) => `Verse ${verse.number}. ${verse.text}`)
    .join("\n");

  const narrationPrompt = [
    `${book.name} chapter ${chapter} from the ${translation.toUpperCase()} translation.`,
    "Read reverently, clearly, and steadily with natural pauses between verses.",
    "Do not add commentary, introductions, or extra words outside the chapter text.",
    chapterNarration,
  ].join("\n\n");

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      voice,
      input: narrationPrompt,
      response_format: "mp3",
      instructions:
        "Narrate this Bible chapter with a calm, warm, Scripture-reading style. Keep verse boundaries audible, but do not say anything outside the passage itself.",
    }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "Audio generation failed.");
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const audioBuffer = await response.arrayBuffer();
  return new Response(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
