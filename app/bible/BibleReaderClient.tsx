"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Bookmark,
  NotebookPen,
} from "lucide-react";
import {
  BIBLE_BOOKS,
  BiblePassageVerse,
  findBibleBook,
  getDefaultBibleReference,
  SUPPORTED_TRANSLATIONS,
} from "@/lib/bible";
import { createClient } from "@/lib/supabase/client";

interface BibleReaderPayload {
  book: string;
  chapter: number;
  chapterCount: number;
  translation: string;
  verses: BiblePassageVerse[];
  previousChapter: number | null;
  nextChapter: number | null;
}

export default function BibleReaderClient({
  initialBook,
  initialChapter,
}: {
  initialBook?: string;
  initialChapter?: number;
}) {
  const router = useRouter();
  const defaults = getDefaultBibleReference();
  const defaultBook = findBibleBook(initialBook ?? "")?.name ?? defaults.book;
  const defaultChapter = initialChapter && initialChapter > 0 ? initialChapter : defaults.chapter;
  const [book, setBook] = useState(defaultBook);
  const [chapter, setChapter] = useState(defaultChapter);
  const [translation, setTranslation] = useState<string>(defaults.translation);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [payload, setPayload] = useState<BibleReaderPayload | null>(null);

  useEffect(() => {
    try {
      const supabase = createClient();
      void supabase.auth.getSession().then(({ data }) => {
        setSignedIn(Boolean(data.session));
      });
    } catch {}
  }, []);

  useEffect(() => {
    async function loadPassage() {
      setLoading(true);
      const params = new URLSearchParams({
        book,
        chapter: String(chapter),
        translation,
      });

      const response = await fetch(`/api/bible/passage?${params.toString()}`);
      if (response.ok) {
        const data = (await response.json()) as BibleReaderPayload;
        setPayload(data);
      }
      setLoading(false);
    }

    void loadPassage();
  }, [book, chapter, translation]);

  const chapterOptions = useMemo(() => {
    const currentBook = findBibleBook(book);
    const chapterCount = currentBook?.chapters ?? 1;
    return Array.from({ length: chapterCount }, (_, index) => index + 1);
  }, [book]);

  const chapterReference = `${book} ${chapter}`;
  const leadText = payload?.verses[0]?.text ?? "";

  function navigate(nextBook: string, nextChapter: number) {
    setBook(nextBook);
    setChapter(nextChapter);
    router.push(`/bible/${encodeURIComponent(nextBook)}/${nextChapter}`);
  }

  async function saveBookmark() {
    const response = await fetch("/api/user/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: chapterReference,
        type: "bible reader",
      }),
    });

    setStatus(response.ok ? "Chapter bookmarked." : "Unable to bookmark chapter.");
  }

  async function logStudy() {
    const response = await fetch("/api/user/studies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: chapterReference,
        translation,
        timeSpentMinutes: 12,
        completed: true,
      }),
    });

    setStatus(response.ok ? "Study session logged." : "Unable to log study session.");
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero bible-reader-hero">
        <p className="eyebrow">Bible reader</p>
        <h1>Read whole chapters with a calmer study flow.</h1>
        <p className="content-lead">
          Move through Scripture chapter by chapter, switch translations, and
          hand off naturally into notes, bookmarks, journaling, and deeper study.
        </p>
      </section>

      <section className="bible-reader-controls">
        <div className="content-card bible-reader-selects">
          <div>
            <label className="minimal-label">Book</label>
            <select
              value={book}
              onChange={(event) => navigate(event.target.value, 1)}
              className="minimal-select"
            >
              {BIBLE_BOOKS.map((entry) => (
                <option key={entry.name} value={entry.name}>
                  {entry.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="minimal-label">Chapter</label>
            <select
              value={chapter}
              onChange={(event) => navigate(book, Number(event.target.value))}
              className="minimal-select"
            >
              {chapterOptions.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="minimal-label">Translation</label>
            <select
              value={translation}
              onChange={(event) => setTranslation(event.target.value)}
              className="minimal-select"
            >
              {SUPPORTED_TRANSLATIONS.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="content-card bible-reader-actions">
          <div className="content-chip-row">
            <span className="content-chip">{chapterReference}</span>
            <span className="content-chip">
              {translation.toUpperCase()}
            </span>
          </div>
          <div className="content-actions">
            <button
              type="button"
              className="button-secondary"
              disabled={!payload?.previousChapter}
              onClick={() =>
                payload?.previousChapter ? navigate(book, payload.previousChapter) : null
              }
            >
              <ArrowLeft size={16} />
              Previous
            </button>
            <button
              type="button"
              className="button-secondary"
              disabled={!payload?.nextChapter}
              onClick={() =>
                payload?.nextChapter ? navigate(book, payload.nextChapter) : null
              }
            >
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="bible-reader-layout">
        <section className="content-card bible-reader-panel">
          <div className="content-section-heading">
            <p className="eyebrow">Reading</p>
            <h2>{chapterReference}</h2>
          </div>
          {loading ? (
            <p className="content-card-note">Loading passage...</p>
          ) : (
            <div className="bible-reader-verses">
              {payload?.verses.map((verse) => (
                <p key={verse.number} className="bible-reader-verse">
                  <span>{verse.number}</span>
                  {verse.text}
                </p>
              ))}
            </div>
          )}
        </section>

        <aside className="bible-reader-sidebar">
          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Quick actions</p>
              <h2>Move into study</h2>
            </div>
            <div className="content-stack">
              <Link
                href={`/passage/${encodeURIComponent(chapterReference)}`}
                className="button-primary"
              >
                <BookOpenText size={16} />
                Open passage study
              </Link>
              <Link href="/journal" className="button-secondary">
                <NotebookPen size={16} />
                Open journal
              </Link>
              <Link
                href={`/share/verse?verse=${encodeURIComponent(leadText)}&reference=${encodeURIComponent(chapterReference)}`}
                className="button-secondary"
              >
                Share chapter lead
              </Link>
            </div>
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Saved state</p>
              <h2>Capture this chapter</h2>
            </div>
            {signedIn ? (
              <div className="content-stack">
                <button type="button" className="button-secondary" onClick={() => void saveBookmark()}>
                  <Bookmark size={16} />
                  Bookmark chapter
                </button>
                <button type="button" className="button-secondary" onClick={() => void logStudy()}>
                  Log study session
                </button>
              </div>
            ) : (
              <p className="content-card-note">
                Sign in to save bookmarks and reading progress from the Bible reader.
              </p>
            )}
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Explore further</p>
              <h2>Other entry points</h2>
            </div>
            <div className="content-stack">
              <Link href="/search" className="button-secondary">
                Search Scripture
              </Link>
              <Link href="/verse-comparison" className="button-secondary">
                Verse comparison
              </Link>
              <Link href="/reading-plans" className="button-secondary">
                Reading plans
              </Link>
            </div>
          </section>
        </aside>
      </section>

      {status ? <p className="share-status">{status}</p> : null}
    </main>
  );
}
