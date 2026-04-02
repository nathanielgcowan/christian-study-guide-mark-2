"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  BookMarked,
  Compass,
  MessageSquareQuote,
  NotebookPen,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSuggestedAtlasContext } from "@/lib/bible-atlas";
import { getSuggestedDictionaryEntries } from "@/lib/biblical-dictionary";
import { BiblePassageVerse, getVerseStudyResource, parseBibleReference } from "@/lib/bible";
import { getReferenceContext } from "@/lib/bible-context";
import {
  addReferenceToCollection,
  getStudyCollections,
  pushRecentPassage,
  StudyCollection,
} from "@/lib/client-features";
import {
  getPassageAssistantSuggestedQuestions,
  PassageAssistantMessage,
  PassageAssistantReply,
} from "@/lib/passage-assistant";

interface ComparisonResult {
  reference: string;
  text: string;
  version: string;
}

interface NoteItem {
  id: string;
  reference: string;
  content: string;
  noteType: string;
  updatedAt?: string;
}

interface BookmarkItem {
  id: string;
  reference: string;
  createdAt?: string;
}

interface StudyItem {
  id?: string;
  reference: string;
  translation?: string;
  time_spent_minutes?: number;
  completed?: boolean;
  read_at?: string;
}

interface StudyStreak {
  current_streak: number;
  best_streak: number;
  total_studies: number;
  last_read_date?: string | null;
}

const relatedPassages: Record<string, string[]> = {
  "John 3:16": ["Romans 5:8", "1 John 4:9-10", "Ephesians 2:4-5"],
  "Psalm 119:105": ["Proverbs 6:23", "2 Timothy 3:16-17", "James 1:22-25"],
  "Romans 8:28": ["Genesis 50:20", "James 1:2-4", "Philippians 1:6"],
};

function getRelatedPassages(reference: string) {
  return relatedPassages[reference] ?? ["Psalm 119:105", "Romans 8:28", "John 3:16"];
}

function normalizeReference(value: string) {
  return value.trim().toLowerCase();
}

function isRelatedToPassage(candidate: string, target: string) {
  const normalizedCandidate = normalizeReference(candidate);
  const normalizedTarget = normalizeReference(target);

  return (
    normalizedCandidate === normalizedTarget ||
    normalizedCandidate.startsWith(`${normalizedTarget}:`) ||
    normalizedTarget.startsWith(`${normalizedCandidate}:`)
  );
}

export default function PassagePage() {
  const params = useParams<{ reference: string }>();
  const reference = decodeURIComponent(params.reference);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [comparison, setComparison] = useState<ComparisonResult[]>([]);
  const [chapterVerses, setChapterVerses] = useState<BiblePassageVerse[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [recentStudies, setRecentStudies] = useState<StudyItem[]>([]);
  const [streak, setStreak] = useState<StudyStreak | null>(null);
  const [collections, setCollections] = useState<StudyCollection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantConversation, setAssistantConversation] = useState<
    Array<{ question: string; reply: PassageAssistantReply }>
  >([]);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantMode, setAssistantMode] = useState<"openai" | "local-fallback" | null>(null);
  const [assistantError, setAssistantError] = useState<string | null>(null);

  useEffect(() => {
    const availableCollections = getStudyCollections();
    setCollections(availableCollections);
    setSelectedCollectionId((current) => current || availableCollections[0]?.id || "");
  }, []);

  useEffect(() => {
    setAssistantConversation([]);
    setAssistantQuestion("");
    setAssistantMode(null);
    setAssistantError(null);
  }, [reference]);

  useEffect(() => {
    const parsed = parseBibleReference(reference);
    const href =
      parsed?.isChapterReference && parsed.chapter
        ? `/bible/${encodeURIComponent(parsed.book)}/${parsed.chapter}`
        : `/passage/${encodeURIComponent(reference)}`;

    void pushRecentPassage({
      reference,
      href,
      type: parsed?.isChapterReference ? "chapter" : "passage",
    });
  }, [reference]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSignedIn(Boolean(session));

      const parsedReference = parseBibleReference(reference);
      const isChapterReference = Boolean(parsedReference?.isChapterReference);

      if (isChapterReference && parsedReference?.chapter) {
        const chapterResponse = await fetch(
          `/api/bible/passage?book=${encodeURIComponent(parsedReference.book)}&chapter=${parsedReference.chapter}&translation=web`,
        );

        if (chapterResponse.ok) {
          const data = (await chapterResponse.json()) as { verses: BiblePassageVerse[] };
          setChapterVerses(data.verses ?? []);
        } else {
          setChapterVerses([]);
        }

        setComparison([]);
      } else {
        setChapterVerses([]);

        const compareResponse = await fetch("/api/bible/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference,
            translations: ["web", "kjv", "asv"],
          }),
        });

        if (compareResponse.ok) {
          const data = (await compareResponse.json()) as {
            results: ComparisonResult[];
          };
          setComparison(data.results);
        }
      }

      if (session) {
        const [notesResponse, bookmarksResponse, studiesResponse] = await Promise.all([
          fetch("/api/user/notes"),
          fetch("/api/user/bookmarks"),
          fetch("/api/user/studies"),
        ]);

        if (notesResponse.ok) {
          const data = (await notesResponse.json()) as { notes: NoteItem[] };
          setNotes(
            data.notes.filter((note) => isRelatedToPassage(note.reference, reference)),
          );
        }

        if (bookmarksResponse.ok) {
          const data = (await bookmarksResponse.json()) as {
            bookmarks: BookmarkItem[];
          };
          setBookmarks(
            data.bookmarks.filter((bookmark) =>
              isRelatedToPassage(bookmark.reference, reference),
            ),
          );
        }

        if (studiesResponse.ok) {
          const data = (await studiesResponse.json()) as {
            streak?: StudyStreak;
            recentStudies?: StudyItem[];
          };
          setStreak(data.streak ?? null);
          setRecentStudies(
            (data.recentStudies ?? []).filter((study) =>
              isRelatedToPassage(study.reference, reference),
            ),
          );
        }
      } else {
        setNotes([]);
        setBookmarks([]);
        setRecentStudies([]);
        setStreak(null);
      }

      setLoading(false);
    }

    void load();
  }, [reference]);

  const parsedReference = useMemo(() => parseBibleReference(reference), [reference]);
  const isChapterReference = Boolean(parsedReference?.isChapterReference);
  const primaryText = isChapterReference
    ? chapterVerses.map((verse) => `${verse.number}. ${verse.text}`).join("\n\n")
    : comparison[0]?.text ?? "Loading passage...";
  const related = useMemo(() => getRelatedPassages(reference), [reference]);
  const prompts = useMemo(() => getPassageAssistantSuggestedQuestions(reference), [reference]);
  const dictionarySuggestions = useMemo(
    () => getSuggestedDictionaryEntries(reference),
    [reference],
  );
  const atlasSuggestions = useMemo(
    () => getSuggestedAtlasContext(reference),
    [reference],
  );
  const referenceContext = useMemo(() => getReferenceContext(reference), [reference]);
  const studyResource = useMemo(
    () =>
      getVerseStudyResource(
        isChapterReference && parsedReference?.chapter
          ? `${parsedReference.book} ${parsedReference.chapter}:1`
          : reference,
        isChapterReference
          ? chapterVerses[0]?.text ?? primaryText
          : primaryText,
      ),
    [chapterVerses, isChapterReference, parsedReference, primaryText, reference],
  );
  const noteCount = notes.filter((note) => note.noteType !== "highlight").length;
  const assistantSuggestions = useMemo(() => prompts.slice(0, 4), [prompts]);

  async function askAssistant(question: string) {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    setAssistantQuestion(trimmedQuestion);
    setAssistantLoading(true);
    setAssistantError(null);

    const history: PassageAssistantMessage[] = assistantConversation.flatMap((entry) => [
      { role: "user", content: entry.question },
      { role: "assistant", content: entry.reply.answer },
    ]);

    const response = await fetch("/api/ai/passage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        primaryText,
        question: trimmedQuestion,
        history,
      }),
    });

    setAssistantLoading(false);

    if (!response.ok) {
      setAssistantError("The study assistant could not answer right now.");
      return;
    }

    const data = (await response.json()) as {
      reply?: PassageAssistantReply;
      provider?: "openai" | "local-fallback";
      error?: string;
    };

    if (!data.reply) {
      setAssistantError("The study assistant did not return a usable answer.");
      return;
    }

    setAssistantMode(data.provider ?? null);
    setAssistantConversation((current) => [
      ...current,
      { question: trimmedQuestion, reply: data.reply as PassageAssistantReply },
    ]);
  }

  function handleAssistantSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askAssistant(assistantQuestion);
  }

  async function saveBookmark() {
    const response = await fetch("/api/user/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        type: "passage study",
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as BookmarkItem;
      setBookmarks((current) => [data, ...current]);
      setShareStatus("Passage bookmarked.");
      return;
    }

    setShareStatus("Unable to bookmark this passage.");
  }

  async function saveStudy() {
    const response = await fetch("/api/user/studies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        translation: "web",
        timeSpentMinutes: 10,
        completed: true,
      }),
    });

    if (!response.ok) {
      setShareStatus("Unable to log study session.");
      return;
    }

    const data = (await response.json()) as {
      study?: StudyItem;
      streak?: StudyStreak;
    };

    if (data.study) {
      setRecentStudies((current) => [data.study as StudyItem, ...current].slice(0, 5));
    }

    if (data.streak) {
      setStreak(data.streak);
    }

    setShareStatus("Study session logged.");
  }

  async function saveNote() {
    if (!noteDraft.trim()) return;

    const response = await fetch("/api/user/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        content: noteDraft.trim(),
        noteType: "note",
        color: "#f0efe9",
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as NoteItem;
      setNotes((current) => [data, ...current]);
      setNoteDraft("");
      setShareStatus("Note saved.");
      return;
    }

    setShareStatus("Unable to save note.");
  }

  function saveToCollection() {
    if (!selectedCollectionId) {
      setShareStatus("Choose a collection first.");
      return;
    }

    const nextCollections = addReferenceToCollection(selectedCollectionId, {
      reference,
      href: `/passage/${encodeURIComponent(reference)}`,
    });
    setCollections(nextCollections);
    setShareStatus("Saved to your study collection.");
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Passage study</p>
        <h1>Study {reference} in a single, passage-centered workspace.</h1>
        <p className="content-lead">
          {isChapterReference
            ? "Read a full chapter in one place, keep your notes close, and move naturally into deeper study tools without losing your place."
            : "Read the text, compare translations, capture notes, trace related passages, and keep your study history gathered around the same reference instead of jumping between disconnected tools."}
        </p>
        <div className="content-chip-row">
          <span className="content-chip">{isChapterReference ? "Full chapter reading" : "Comparison"}</span>
          <span className="content-chip">Notes and bookmarks</span>
          <span className="content-chip">Study history</span>
          <span className="content-chip">Reflection prompts</span>
        </div>
      </section>

      <section className="content-grid-three passage-study-metrics">
        <article className="content-stat">
          <span>Saved notes</span>
          <strong>{noteCount}</strong>
        </article>
        <article className="content-stat">
          <span>Bookmarks here</span>
          <strong>{bookmarks.length}</strong>
        </article>
        <article className="content-stat">
          <span>Current streak</span>
          <strong>{streak?.current_streak ?? 0}</strong>
        </article>
      </section>

      <section className="passage-study-layout">
        <section className="content-card passage-study-main">
          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Reading</p>
              <h2>{reference}</h2>
            </div>
            <div className="reader-prose">
              {isChapterReference ? (
                <div className="passage-study-chapter">
                  {chapterVerses.map((verse) => (
                    <p key={`${reference}-${verse.number}`} className="passage-study-chapter-verse">
                      <span>{verse.number}</span>
                      {verse.text}
                    </p>
                  ))}
                </div>
              ) : (
                <p>{primaryText}</p>
              )}
            </div>
            <div className="content-actions">
              {!isChapterReference ? (
                <>
                  <Link
                    href={`/share/verse?verse=${encodeURIComponent(primaryText)}&reference=${encodeURIComponent(reference)}`}
                    className="button-secondary"
                  >
                    Share passage
                  </Link>
                  <Link
                    href={`/user/verse-generator?verse=${encodeURIComponent(primaryText)}&reference=${encodeURIComponent(reference)}`}
                    className="button-secondary"
                  >
                    Create image
                  </Link>
                </>
              ) : null}
              <Link
                href={
                  parsedReference?.chapter
                    ? `/bible/${encodeURIComponent(parsedReference.book)}/${parsedReference.chapter}`
                    : "/bible"
                }
                className="button-secondary"
              >
                Open Bible reader
              </Link>
            </div>
            <div className="content-actions">
              <select
                value={selectedCollectionId}
                onChange={(event) => setSelectedCollectionId(event.target.value)}
                className="minimal-select"
              >
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
              <button type="button" className="button-secondary" onClick={saveToCollection}>
                Save to collection
              </button>
              <Link href="/collections" className="button-secondary">
                Open collections
              </Link>
            </div>
          </section>

          {isChapterReference ? (
            <section className="content-card">
              <div className="content-section-heading">
                <p className="eyebrow">Chapter reading</p>
                <h2>Read the whole chapter at once</h2>
              </div>
              <div className="content-stack">
                <article className="passage-study-translation">
                  <strong>{reference}</strong>
                  <p>
                    This passage workspace now renders the full chapter directly.
                    Use the Bible reader if you want next/previous chapter
                    navigation, verse-level highlights, and continuous reading.
                  </p>
                </article>
              </div>
            </section>
          ) : (
            <section className="content-card">
              <div className="content-section-heading">
                <p className="eyebrow">Comparison</p>
                <h2>Read across translations</h2>
              </div>
              <div className="content-stack">
                {comparison.map((item) => (
                  <article key={item.version} className="passage-study-translation">
                    <strong>{item.version}</strong>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Commentary layer</p>
              <h2>Short study notes beside the passage</h2>
            </div>
            <div className="content-stack">
              {studyResource.commentary.map((entry) => (
                <article key={`${reference}-${entry.title}`} className="passage-study-translation">
                  <strong>{entry.title}</strong>
                  <p>{entry.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Cross references</p>
              <h2>Trace how this passage connects across Scripture</h2>
            </div>
            <div className="content-stack">
              {studyResource.crossReferences.map((entry) => (
                <article key={`${reference}-${entry.reference}`} className="passage-study-translation">
                  <strong>{entry.label}</strong>
                  <p>{entry.reason}</p>
                  <Link
                    href={`/passage/${encodeURIComponent(entry.reference)}`}
                    className="button-secondary"
                  >
                    Open {entry.reference}
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Original-language tools</p>
              <h2>Greek and Hebrew study without leaving the passage</h2>
            </div>
            <div className="content-stack">
              {studyResource.originalLanguage.map((entry) => (
                <article key={`${reference}-${entry.strongs}`} className="passage-study-translation">
                  <strong>
                    {entry.term} · {entry.language}
                  </strong>
                  <p>
                    <em>{entry.transliteration}</em> · {entry.partOfSpeech} · {entry.strongs}
                  </p>
                  <p>{entry.definition}</p>
                  <p>{entry.nuance}</p>
                  <div className="dictionary-link-list">
                    {entry.relatedReferences.map((relatedReference) => (
                      <Link
                        key={`${entry.strongs}-${relatedReference}`}
                        href={`/passage/${encodeURIComponent(relatedReference)}`}
                        className="button-secondary"
                      >
                        {relatedReference}
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">AI study assistant</p>
              <h2>Ask questions about the text in context</h2>
            </div>
            <div className="content-card-note">
              <strong>Ask about meaning, context, application, people, places, or key words.</strong>
              <p>
                This assistant answers from the passage text, commentary layer, cross references,
                timeline context, dictionary entries, and original-language study notes already loaded here.
              </p>
            </div>
            <form onSubmit={handleAssistantSubmit} className="content-stack">
              <textarea
                value={assistantQuestion}
                onChange={(event) => setAssistantQuestion(event.target.value)}
                className="minimal-textarea"
                rows={4}
                placeholder="Ask a question like: What is the main point of this passage? or How should I pray this text?"
              />
              <div className="content-actions">
                <button type="submit" className="button-primary" disabled={assistantLoading}>
                  {assistantLoading ? "Thinking..." : "Ask assistant"}
                </button>
              </div>
            </form>
            <div className="dictionary-link-list">
              {assistantSuggestions.slice(0, 4).map((question) => (
                <button
                  key={question}
                  type="button"
                  className="button-secondary"
                  onClick={() => void askAssistant(question)}
                  disabled={assistantLoading}
                >
                  {question}
                </button>
              ))}
            </div>
            {assistantMode ? (
              <article className="content-card-note">
                <strong>
                  {assistantMode === "openai"
                    ? "Live AI response"
                    : "Grounded local fallback"}
                </strong>
                <p>
                  {assistantMode === "openai"
                    ? "This reply came from the server-backed AI assistant using the passage packet as grounding."
                    : "The AI backend is unavailable right now, so the page is answering from the local study packet instead."}
                </p>
              </article>
            ) : null}
            {assistantConversation.length > 0 ? (
              <div className="content-stack">
                {assistantConversation.map((entry, index) => (
                  <div key={`${entry.question}-${index}`} className="content-stack">
                    <article className="content-card-note">
                      <strong>You asked</strong>
                      <p>{entry.question}</p>
                    </article>
                    <article className="content-card-note">
                      <strong>{entry.reply.title}</strong>
                      <p>{entry.reply.answer}</p>
                    </article>
                    {entry.reply.supports.map((item) => (
                      <article key={`${entry.question}-${item}`} className="content-card-note">
                        <p>{item}</p>
                      </article>
                    ))}
                    <article className="content-card-note">
                      <strong>Grounding used</strong>
                      <p>{entry.reply.citations.join(", ")}</p>
                      {entry.reply.limitation ? <p>{entry.reply.limitation}</p> : null}
                    </article>
                    <article className="content-card-note">
                      <strong>Keep exploring</strong>
                      <div className="dictionary-link-list">
                        {entry.reply.followUpQuestions.map((question) => (
                          <button
                            key={`${entry.question}-${question}`}
                            type="button"
                            className="button-secondary"
                            onClick={() => void askAssistant(question)}
                            disabled={assistantLoading}
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            ) : (
              <article className="content-card-note">
                <p>
                  Start with a question and this study assistant will pull together the strongest
                  context already available on the page.
                </p>
              </article>
            )}
            {assistantError ? <p className="share-status">{assistantError}</p> : null}
          </section>

          <section className="content-grid-two">
            <section className="content-card">
              <span className="content-badge">
                <NotebookPen size={14} />
                Notes workspace
              </span>
              <h2>Capture observations, questions, and prayer responses</h2>
              {signedIn ? (
                <>
                  <textarea
                    value={noteDraft}
                    onChange={(event) => setNoteDraft(event.target.value)}
                    className="minimal-textarea"
                    rows={6}
                    placeholder="Write an observation, question, prayer, or application..."
                  />
                  <div className="content-actions">
                    <button type="button" className="button-primary" onClick={() => void saveNote()}>
                      Save note
                    </button>
                    <Link href="/journal" className="button-secondary">
                      Open full journal
                    </Link>
                  </div>
                </>
              ) : (
                <p className="content-card-note">
                  Sign in to keep notes, bookmarks, and study activity tied to
                  this passage.
                </p>
              )}
            </section>

            <section className="content-card">
              <span className="content-badge">
                <Compass size={14} />
                Reflection prompts
              </span>
              <h2>Questions that keep you inside the text</h2>
              <div className="content-stack">
                {prompts.map((prompt) => (
                  <article key={prompt} className="passage-study-prompt">
                    <p>{prompt}</p>
                  </article>
                ))}
              </div>
            </section>
          </section>
        </section>

        <aside className="passage-study-rail">
          <section className="content-card">
            <span className="content-badge">
              <MessageSquareQuote size={14} />
              Assistant
            </span>
            <h2>Good questions to ask here</h2>
            <div className="content-stack">
              {assistantSuggestions.slice(0, 3).map((question) => (
                <button
                  key={question}
                  type="button"
                  className="button-secondary"
                  onClick={() => void askAssistant(question)}
                  disabled={assistantLoading}
                >
                  {question}
                </button>
              ))}
            </div>
          </section>

          <section className="content-card">
            <span className="content-badge">
              <BookMarked size={14} />
              Study actions
            </span>
            <h2>Keep your place</h2>
            {signedIn ? (
              <div className="content-stack">
                <button type="button" className="button-secondary" onClick={() => void saveBookmark()}>
                  Bookmark passage
                </button>
                <button type="button" className="button-secondary" onClick={() => void saveStudy()}>
                  Log study session
                </button>
                <Link href="/dashboard" className="button-secondary">
                  Open dashboard
                </Link>
              </div>
            ) : (
              <p className="content-card-note">
                Sign in to keep bookmarks, streaks, and recent study history for this reference.
              </p>
            )}
          </section>

          <section className="content-card">
            <span className="content-badge">
              <Archive size={14} />
              Collections
            </span>
            <h2>Keep related passages together</h2>
            <div className="content-stack">
              {collections.slice(0, 3).map((collection) => (
                <article key={collection.id} className="content-card-note">
                  <strong>{collection.name}</strong>
                  <p>{collection.description}</p>
                  <p>
                    {collection.items.length} saved reference
                    {collection.items.length === 1 ? "" : "s"}
                  </p>
                </article>
              ))}
              <Link href="/collections" className="button-secondary">
                Open collections
              </Link>
            </div>
          </section>

          <section className="content-card">
            <span className="content-badge">
              <Sparkles size={14} />
              Related passages
            </span>
            <h2>Trace the theme further</h2>
            <div className="content-stack">
              {related.map((item) => (
                <Link
                  key={item}
                  href={`/passage/${encodeURIComponent(item)}`}
                  className="button-secondary"
                >
                  {item}
                </Link>
              ))}
            </div>
          </section>

          <section className="content-card">
            <span className="content-badge">
              <Compass size={14} />
              Dictionary terms
            </span>
            <h2>Important vocabulary near this passage</h2>
            <div className="content-stack">
              {dictionarySuggestions.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/dictionary/${entry.slug}`}
                  className="content-card-note"
                >
                  <strong>{entry.term}</strong>
                  <p>{entry.summary}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="content-card">
            <span className="content-badge">
              <Compass size={14} />
              Timeline context
            </span>
            <h2>How this passage fits the larger story</h2>
            <div className="content-stack">
              <article className="content-card-note">
                <strong>{referenceContext.bookContext.book}</strong>
                <p>{referenceContext.bookContext.summary}</p>
                <p>
                  {referenceContext.bookContext.era} · {referenceContext.bookContext.approximateDate}
                </p>
              </article>
              {referenceContext.timeline.slice(0, 2).map((event) => (
                <article key={`${reference}-${event.label}`} className="content-card-note">
                  <strong>{event.label}</strong>
                  <p>{event.summary}</p>
                </article>
              ))}
              <Link href="/timeline" className="button-secondary">
                Open full timeline
              </Link>
            </div>
          </section>

          <section className="content-card">
            <span className="content-badge">
              <Compass size={14} />
              People and places
            </span>
            <h2>Follow the characters and setting</h2>
            <div className="content-stack">
              <article className="content-card-note">
                <strong>Character profiles</strong>
                <p>
                  Open people connected to this passage and study their role in
                  the larger biblical story.
                </p>
              </article>
              <div className="dictionary-link-list">
                {atlasSuggestions.characters.map((character) => (
                  <Link
                    key={`${reference}-${character.slug}`}
                    href={`/characters/${character.slug}`}
                    className="button-secondary"
                  >
                    {character.name}
                  </Link>
                ))}
              </div>
              <article className="content-card-note">
                <strong>Bible atlas</strong>
                <p>
                  Trace the geography around the passage so the setting becomes
                  part of the study, not just background information.
                </p>
              </article>
              <div className="dictionary-link-list">
                {atlasSuggestions.locations.map((location) => (
                  <Link
                    key={`${reference}-${location.slug}`}
                    href={`/maps/${location.slug}`}
                    className="button-secondary"
                  >
                    {location.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Recent activity</p>
              <h2>Study history around this passage</h2>
            </div>
            {loading ? (
              <p className="content-card-note">Loading activity...</p>
            ) : recentStudies.length > 0 ? (
              <div className="content-stack">
                {recentStudies.slice(0, 4).map((study, index) => (
                  <article
                    key={`${study.reference}-${study.read_at ?? index}`}
                    className="passage-study-activity-item"
                  >
                    <strong>{study.reference}</strong>
                    <p>
                      {study.translation?.toUpperCase() ?? "WEB"} ·{" "}
                      {study.time_spent_minutes ?? 0} min ·{" "}
                      {study.read_at
                        ? new Date(study.read_at).toLocaleDateString()
                        : "Recent session"}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="content-card-note">
                No study sessions have been logged for this passage yet.
              </p>
            )}
          </section>
        </aside>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Saved reflections</p>
            <h2>Your notes connected to this passage</h2>
          </div>
          {loading ? (
            <p className="content-card-note">Loading notes...</p>
          ) : notes.length > 0 ? (
            <div className="content-stack">
              {notes.map((note) => (
                <article key={note.id} className="passage-study-note-card">
                  <strong>{note.reference}</strong>
                  <p>{note.content}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="content-card-note">
              No saved notes for this passage yet.
            </p>
          )}
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Next step</p>
            <h2>Move from reading into response</h2>
          </div>
          <div className="content-stack">
            <article className="content-card-note">
              <strong>Prayer response</strong>
              <p>
                Carry the main burden or promise of this passage into your prayer journal.
              </p>
              <Link href="/prayer-journal" className="button-secondary">
                Open prayer journal
              </Link>
            </article>
            <article className="content-card-note">
              <strong>Group discussion</strong>
              <p>
                Bring this passage into a shared study setting without losing your own notes.
              </p>
              <Link href="/groups" className="button-secondary">
                Explore groups
              </Link>
            </article>
            <article className="content-card-note">
              <strong>Visual sharing</strong>
              <p>
                Turn the passage into a share image when the text is ready to be encouraged outward.
              </p>
              <Link
                href={`/user/verse-generator?verse=${encodeURIComponent(primaryText)}&reference=${encodeURIComponent(reference)}`}
                className="button-secondary"
              >
                Create verse image
              </Link>
            </article>
          </div>
        </section>
      </section>

      {shareStatus ? <p className="share-status">{shareStatus}</p> : null}
    </main>
  );
}
