"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Bookmark,
  Highlighter,
  Library,
  NotebookPen,
} from "lucide-react";
import {
  BibleChapterPointer,
  BIBLE_BOOKS,
  BiblePassageVerse,
  findBibleBook,
  getBibleReadingProgress,
  getDefaultBibleReference,
  getVerseStudyResource,
  SUPPORTED_TRANSLATIONS,
} from "@/lib/bible";
import { getBookContext, getChapterContext, getReferenceContext } from "@/lib/bible-context";
import { pushRecentPassage } from "@/lib/client-features";
import { createClient } from "@/lib/supabase/client";

interface BibleReaderPayload {
  book: string;
  chapter: number;
  chapterCount: number;
  translation: string;
  verses: BiblePassageVerse[];
  previousChapter: BibleChapterPointer | null;
  nextChapter: BibleChapterPointer | null;
}

interface VerseStudyNote {
  id: string;
  reference: string;
  content: string;
  noteType: string;
  color: string;
}

interface ReadingProgressPayload {
  readingProgress: {
    book: string;
    chapter: number;
    reference: string;
    translation: string;
    updatedAt: string | null;
    progress: {
      completedChapters: number;
      totalChapters: number;
      percentComplete: number;
    };
  };
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
  const hasExplicitInitialReference = Boolean(initialBook || initialChapter);
  const [book, setBook] = useState(defaultBook);
  const [chapter, setChapter] = useState(defaultChapter);
  const [translation, setTranslation] = useState<string>(defaults.translation);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [payload, setPayload] = useState<BibleReaderPayload | null>(null);
  const [notes, setNotes] = useState<VerseStudyNote[]>([]);
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [savingVerse, setSavingVerse] = useState<number | null>(null);
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number | null>(null);
  const [resumeReady, setResumeReady] = useState(hasExplicitInitialReference);
  const [resumeTimestamp, setResumeTimestamp] = useState<string | null>(null);

  useEffect(() => {
    async function loadSessionAndResume() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const isSignedIn = Boolean(session);
        setSignedIn(isSignedIn);

        if (!isSignedIn || hasExplicitInitialReference) {
          setResumeReady(true);
          return;
        }

        const response = await fetch("/api/user/reading-progress");
        if (!response.ok) {
          setResumeReady(true);
          return;
        }

        const data = (await response.json()) as ReadingProgressPayload;
        if (data.readingProgress) {
          setBook(data.readingProgress.book);
          setChapter(data.readingProgress.chapter);
          setTranslation(data.readingProgress.translation);
          setResumeTimestamp(data.readingProgress.updatedAt);
        }
      } catch {
      } finally {
        setResumeReady(true);
      }
    }

    void loadSessionAndResume();
  }, [hasExplicitInitialReference]);

  useEffect(() => {
    async function loadPassage() {
      if (!resumeReady) return;
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
        setSelectedVerseNumber((current) =>
          current && data.verses.some((verse) => verse.number === current)
            ? current
            : (data.verses[0]?.number ?? null),
        );
      }
      setLoading(false);
    }

    void loadPassage();
  }, [book, chapter, translation, resumeReady]);

  useEffect(() => {
    async function loadVerseNotes() {
      if (!signedIn) {
        setNotes([]);
        return;
      }

      const response = await fetch("/api/user/notes");
      if (!response.ok) {
        setNotes([]);
        return;
      }

      const data = (await response.json()) as {
        notes?: VerseStudyNote[];
      };
      const chapterPrefix = `${book} ${chapter}:`;
      setNotes(
        (data.notes ?? []).filter((note) => note.reference.startsWith(chapterPrefix)),
      );
    }

    void loadVerseNotes();
  }, [signedIn, book, chapter]);

  useEffect(() => {
    if (!signedIn || !resumeReady) {
      return;
    }

    void fetch("/api/user/reading-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        book,
        chapter,
        translation,
      }),
    }).then(async (response) => {
      if (!response.ok) return;
      const data = (await response.json()) as ReadingProgressPayload;
      setResumeTimestamp(data.readingProgress.updatedAt);
    }).catch(() => {});
  }, [signedIn, resumeReady, book, chapter, translation]);

  useEffect(() => {
    if (!resumeReady) return;

    void pushRecentPassage({
      reference: `${book} ${chapter}`,
      href: `/bible/${encodeURIComponent(book)}/${chapter}`,
      type: "chapter",
    });
  }, [book, chapter, resumeReady]);

  const chapterOptions = useMemo(() => {
    const currentBook = findBibleBook(book);
    const chapterCount = currentBook?.chapters ?? 1;
    return Array.from({ length: chapterCount }, (_, index) => index + 1);
  }, [book]);

  const notesByReference = useMemo(() => {
    const grouped = new Map<string, VerseStudyNote[]>();

    notes.forEach((note) => {
      const existing = grouped.get(note.reference) ?? [];
      existing.push(note);
      grouped.set(note.reference, existing);
    });

    return grouped;
  }, [notes]);

  const chapterReference = `${book} ${chapter}`;
  const leadText = payload?.verses[0]?.text ?? "";
  const selectedVerse =
    payload?.verses.find((verse) => verse.number === selectedVerseNumber) ?? payload?.verses[0] ?? null;
  const selectedVerseReference = selectedVerse
    ? `${book} ${chapter}:${selectedVerse.number}`
    : null;
  const selectedVerseStudy = selectedVerseReference && selectedVerse
    ? getVerseStudyResource(selectedVerseReference, selectedVerse.text)
    : null;
  const bookContext = useMemo(() => getBookContext(book), [book]);
  const chapterSummary = useMemo(() => getChapterContext(book, chapter), [book, chapter]);
  const chapterContext = useMemo(() => getReferenceContext(chapterReference), [chapterReference]);
  const canonProgress = useMemo(() => getBibleReadingProgress(book, chapter), [book, chapter]);

  function navigate(nextBook: string, nextChapter: number) {
    setBook(nextBook);
    setChapter(nextChapter);
    setActiveVerse(null);
    setNoteDraft("");
    setSelectedVerseNumber(null);
    setStatus(null);
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

  async function saveVerseNote(verseNumber: number) {
    const content = noteDraft.trim();
    if (!content) {
      setStatus("Write a note before saving it.");
      return;
    }

    setSavingVerse(verseNumber);
    const reference = `${book} ${chapter}:${verseNumber}`;
    const response = await fetch("/api/user/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        content,
        noteType: "note",
        color: "#f4f1eb",
      }),
    });

    const data = (await response.json()) as VerseStudyNote | { error?: string };
    setSavingVerse(null);

    if (!response.ok || !("id" in data)) {
      setStatus("Unable to save verse note right now.");
      return;
    }

    setNotes((current) => [data, ...current]);
    setStatus(`Saved a note on ${reference}.`);
    setNoteDraft("");
    setActiveVerse(null);
  }

  async function toggleHighlight(verseNumber: number, existingHighlight?: VerseStudyNote) {
    const reference = `${book} ${chapter}:${verseNumber}`;
    setSavingVerse(verseNumber);

    if (existingHighlight) {
      const response = await fetch(`/api/user/notes?id=${existingHighlight.id}`, {
        method: "DELETE",
      });
      setSavingVerse(null);

      if (!response.ok) {
        setStatus("Unable to remove highlight right now.");
        return;
      }

      setNotes((current) => current.filter((note) => note.id !== existingHighlight.id));
      setStatus(`Removed highlight from ${reference}.`);
      return;
    }

    const response = await fetch("/api/user/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        content: "Verse highlight",
        noteType: "highlight",
        color: "#f4e7b2",
      }),
    });

    const data = (await response.json()) as VerseStudyNote | { error?: string };
    setSavingVerse(null);

    if (!response.ok || !("id" in data)) {
      setStatus("Unable to save highlight right now.");
      return;
    }

    setNotes((current) => [data, ...current]);
    setStatus(`Highlighted ${reference}.`);
  }

  async function removeVerseNote(noteId: string, reference: string) {
    const response = await fetch(`/api/user/notes?id=${noteId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setStatus("Unable to remove note right now.");
      return;
    }

    setNotes((current) => current.filter((note) => note.id !== noteId));
    setStatus(`Removed note from ${reference}.`);
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
              onChange={(event) => {
                setTranslation(event.target.value);
                setActiveVerse(null);
                setNoteDraft("");
                setStatus(null);
              }}
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
            <span className="content-chip">
              {canonProgress.percentComplete}% through the Bible
            </span>
            {resumeTimestamp ? (
              <span className="content-chip">
                Saved {new Date(resumeTimestamp).toLocaleDateString()}
              </span>
            ) : null}
          </div>
          <div className="content-actions">
            <button
              type="button"
              className="button-secondary"
              disabled={!payload?.previousChapter}
              onClick={() =>
                payload?.previousChapter
                  ? navigate(payload.previousChapter.book, payload.previousChapter.chapter)
                  : null
              }
            >
              <ArrowLeft size={16} />
              {payload?.previousChapter
                ? `${payload.previousChapter.book} ${payload.previousChapter.chapter}`
                : "Previous"}
            </button>
            <button
              type="button"
              className="button-secondary"
              disabled={!payload?.nextChapter}
              onClick={() =>
                payload?.nextChapter
                  ? navigate(payload.nextChapter.book, payload.nextChapter.chapter)
                  : null
              }
            >
              {payload?.nextChapter
                ? `${payload.nextChapter.book} ${payload.nextChapter.chapter}`
                : "Next"}
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
              {payload?.verses.map((verse) => {
                const verseReference = `${book} ${chapter}:${verse.number}`;
                const verseNotes = notesByReference.get(verseReference) ?? [];
                const highlight = verseNotes.find((note) => note.noteType === "highlight");
                const noteEntries = verseNotes.filter((note) => note.noteType !== "highlight");
                const editorOpen = activeVerse === verse.number;
                const verseBusy = savingVerse === verse.number;

                return (
                  <article
                    key={verse.number}
                    className={`bible-reader-verse-block${highlight ? " bible-reader-verse-highlighted" : ""}${selectedVerseNumber === verse.number ? " bible-reader-verse-selected" : ""}`}
                  >
                    <p className="bible-reader-verse">
                      <span>{verse.number}</span>
                      {verse.text}
                    </p>

                    <div className="bible-reader-verse-actions">
                      <button
                        type="button"
                        className="button-secondary button-small"
                        onClick={() => setSelectedVerseNumber(verse.number)}
                      >
                        <Library size={15} />
                        {selectedVerseNumber === verse.number ? "Studying verse" : "Study verse"}
                      </button>
                      {signedIn ? (
                        <>
                          <button
                            type="button"
                            className="button-secondary button-small"
                            disabled={verseBusy}
                            onClick={() => {
                              setActiveVerse(editorOpen ? null : verse.number);
                              if (editorOpen) {
                                setNoteDraft("");
                              }
                            }}
                          >
                            <NotebookPen size={15} />
                            {editorOpen ? "Close note" : "Add note"}
                          </button>
                          <button
                            type="button"
                            className="button-secondary button-small"
                            disabled={verseBusy}
                            onClick={() => void toggleHighlight(verse.number, highlight)}
                          >
                            <Highlighter size={15} />
                            {highlight ? "Remove highlight" : "Highlight"}
                          </button>
                        </>
                      ) : (
                        <p className="content-card-note">
                          Sign in to save notes and highlights on individual verses.
                        </p>
                      )}
                    </div>

                    {editorOpen && signedIn ? (
                      <div className="bible-reader-note-editor">
                        <label className="minimal-label" htmlFor={`note-${verse.number}`}>
                          Note for {verseReference}
                        </label>
                        <textarea
                          id={`note-${verse.number}`}
                          className="minimal-textarea"
                          placeholder="Write an observation, prayer, or application from this verse."
                          value={noteDraft}
                          onChange={(event) => setNoteDraft(event.target.value)}
                        />
                        <div className="bible-reader-note-editor-actions">
                          <button
                            type="button"
                            className="button-primary button-small"
                            disabled={verseBusy}
                            onClick={() => void saveVerseNote(verse.number)}
                          >
                            Save note
                          </button>
                          <button
                            type="button"
                            className="button-secondary button-small"
                            onClick={() => {
                              setActiveVerse(null);
                              setNoteDraft("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {noteEntries.length > 0 ? (
                      <div className="bible-reader-verse-notes">
                        {noteEntries.map((note) => (
                          <article key={note.id} className="bible-reader-note">
                            <p>{note.content}</p>
                            <button
                              type="button"
                              className="bible-reader-note-link"
                              onClick={() => void removeVerseNote(note.id, note.reference)}
                            >
                              Remove note
                            </button>
                          </article>
                        ))}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="bible-reader-sidebar">
          <section className="content-card bible-reader-study-panel">
            <div className="content-section-heading">
              <p className="eyebrow">Verse study</p>
              <h2>{selectedVerseReference ?? "Choose a verse"}</h2>
            </div>
            {selectedVerse && selectedVerseStudy ? (
              <div className="content-stack">
                <p className="content-card-note">{selectedVerseStudy.summary}</p>
                <div className="bible-reader-study-verse">
                  <span className="content-chip">Selected verse</span>
                  <p>{selectedVerse.text}</p>
                </div>
                <div className="bible-reader-study-section">
                  <h3>Cross references</h3>
                  <div className="bible-reader-cross-reference-list">
                    {selectedVerseStudy.crossReferences.map((entry) => (
                      <Link
                        key={`${selectedVerseReference}-${entry.reference}`}
                        href={`/passage/${encodeURIComponent(entry.reference)}`}
                        className="bible-reader-cross-reference"
                      >
                        <strong>{entry.reference}</strong>
                        <span>{entry.label}</span>
                        <p>{entry.reason}</p>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="bible-reader-study-section">
                  <h3>Commentary</h3>
                  <div className="bible-reader-commentary-list">
                    {selectedVerseStudy.commentary.map((entry) => (
                      <article
                        key={`${selectedVerseReference}-${entry.title}`}
                        className="bible-reader-commentary-card"
                      >
                        <h4>{entry.title}</h4>
                        <p>{entry.body}</p>
                      </article>
                    ))}
                  </div>
                </div>
                <div className="bible-reader-study-section">
                  <h3>Greek and Hebrew word study</h3>
                  <div className="bible-reader-commentary-list">
                    {selectedVerseStudy.originalLanguage.map((entry) => (
                      <article
                        key={`${selectedVerseReference}-${entry.strongs}`}
                        className="bible-reader-commentary-card"
                      >
                        <div className="bible-reader-word-header">
                          <strong>{entry.term}</strong>
                          <span>{entry.language} · {entry.strongs}</span>
                        </div>
                        <p>
                          <em>{entry.transliteration}</em> · {entry.partOfSpeech}
                        </p>
                        <p>{entry.definition}</p>
                        <p>{entry.nuance}</p>
                        <div className="dictionary-link-list">
                          {entry.relatedReferences.map((reference) => (
                            <Link
                              key={`${entry.strongs}-${reference}`}
                              href={`/passage/${encodeURIComponent(reference)}`}
                              className="button-secondary"
                            >
                              {reference}
                            </Link>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="content-card-note">
                Pick a verse to open cross references, commentary, and original-language word cards without leaving the chapter.
              </p>
            )}
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Book introduction</p>
              <h2>Read {bookContext.book} with orientation</h2>
            </div>
            <div className="content-stack">
              <article className="content-card-note">
                <strong>{bookContext.book}</strong>
                <p>{bookContext.summary}</p>
                <p>{bookContext.author} · {bookContext.approximateDate}</p>
              </article>
              <div className="dictionary-chip-group">
                {bookContext.themes.map((theme) => (
                  <span key={`${bookContext.book}-${theme}`} className="content-chip">
                    {theme}
                  </span>
                ))}
              </div>
              <p className="content-card-note">{bookContext.whyReadIt}</p>
              <Link
                href={`/bible/${encodeURIComponent(bookContext.book)}`}
                className="button-secondary"
              >
                Open full book introduction
              </Link>
            </div>
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Chapter summary</p>
              <h2>{chapterSummary.title}</h2>
            </div>
            <div className="content-stack">
              <article className="content-card-note">
                <p>{chapterSummary.summary}</p>
              </article>
              <div className="bible-reader-focus-list">
                {chapterSummary.readingFocus.map((item) => (
                  <article
                    key={`${chapterReference}-${item}`}
                    className="bible-reader-focus-card"
                  >
                    <p>{item}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Timeline context</p>
              <h2>Where this chapter sits</h2>
            </div>
            <div className="content-stack">
              <article className="content-card-note">
                <strong>{bookContext.book}</strong>
                <p>{bookContext.summary}</p>
                <p>{bookContext.era} · {bookContext.approximateDate}</p>
              </article>
              {chapterContext.timeline.slice(0, 2).map((event) => (
                <article key={`${chapterReference}-${event.label}`} className="content-card-note">
                  <strong>{event.label}</strong>
                  <p>{event.summary}</p>
                </article>
              ))}
              <Link href="/timeline" className="button-secondary">
                Open Bible timeline
              </Link>
            </div>
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Read front to back</p>
              <h2>Stay in a continuous Bible-reading flow</h2>
            </div>
            <div className="content-stack">
              <article className="content-card-note">
                <strong>Canonical progress</strong>
                <p>
                  You are at {chapterReference}, which is chapter {canonProgress.completedChapters} of{" "}
                  {canonProgress.totalChapters} in the full Bible reading order.
                </p>
                {signedIn ? (
                  <p>
                    Your reading place is being saved automatically so you can resume from the dashboard or return to `/bible` later.
                  </p>
                ) : null}
              </article>
              <div className="dictionary-link-list">
                {payload?.previousChapter ? (
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() =>
                      navigate(payload.previousChapter!.book, payload.previousChapter!.chapter)
                    }
                  >
                    Previous chapter
                  </button>
                ) : null}
                {payload?.nextChapter ? (
                  <button
                    type="button"
                    className="button-primary"
                    onClick={() =>
                      navigate(payload.nextChapter!.book, payload.nextChapter!.chapter)
                    }
                  >
                    Continue reading
                  </button>
                ) : null}
              </div>
            </div>
          </section>

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
