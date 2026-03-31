import { NextResponse } from "next/server";
import {
  getAdjacentBibleChapter,
  findBibleBook,
  getChapterPassage,
  getDefaultBibleReference,
  SUPPORTED_TRANSLATIONS,
} from "@/lib/bible";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedBook = searchParams.get("book") ?? getDefaultBibleReference().book;
  const requestedChapter = Number(
    searchParams.get("chapter") ?? getDefaultBibleReference().chapter,
  );
  const requestedTranslation =
    searchParams.get("translation") ?? getDefaultBibleReference().translation;

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
  const nextChapter = getAdjacentBibleChapter(book.name, chapter, "next");
  const previousChapter = getAdjacentBibleChapter(book.name, chapter, "previous");

  return NextResponse.json({
    book: book.name,
    chapter,
    chapterCount: book.chapters,
    translation,
    verses,
    previousChapter,
    nextChapter,
  });
}
