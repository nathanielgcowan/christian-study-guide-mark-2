"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  BookMarked,
  NotebookPen,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
}

interface BookmarkItem {
  id: string;
  reference: string;
}

const relatedPassages: Record<string, string[]> = {
  "John 3:16": ["Romans 5:8", "1 John 4:9-10", "Ephesians 2:4-5"],
  "Psalm 119:105": ["Proverbs 6:23", "2 Timothy 3:16-17", "James 1:22-25"],
  "Romans 8:28": ["Genesis 50:20", "James 1:2-4", "Philippians 1:6"],
};

function getRelatedPassages(reference: string) {
  return relatedPassages[reference] ?? ["Psalm 119:105", "Romans 8:28", "John 3:16"];
}

export default function PassagePage() {
  const params = useParams<{ reference: string }>();
  const reference = decodeURIComponent(params.reference);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [comparison, setComparison] = useState<ComparisonResult[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSignedIn(Boolean(session));

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

      if (session) {
        const [notesResponse, bookmarksResponse] = await Promise.all([
          fetch("/api/user/notes"),
          fetch("/api/user/bookmarks"),
        ]);

        if (notesResponse.ok) {
          const data = (await notesResponse.json()) as { notes: NoteItem[] };
          setNotes(
            data.notes.filter(
              (note) =>
                note.reference.toLowerCase() === reference.toLowerCase(),
            ),
          );
        }

        if (bookmarksResponse.ok) {
          const data = (await bookmarksResponse.json()) as {
            bookmarks: BookmarkItem[];
          };
          setBookmarks(
            data.bookmarks.filter(
              (bookmark) =>
                bookmark.reference.toLowerCase() === reference.toLowerCase(),
            ),
          );
        }
      }

      setLoading(false);
    }

    void load();
  }, [reference]);

  const primaryText = comparison[0]?.text ?? "Loading passage...";
  const related = useMemo(() => getRelatedPassages(reference), [reference]);

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

    setShareStatus(
      response.ok ? "Study session logged." : "Unable to log study session.",
    );
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

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Passage study</p>
        <h1>Study {reference} with context, comparison, and response tools.</h1>
        <p className="content-lead">
          The passage page brings together translation comparison, personal
          notes, bookmarks, related passages, and quick study actions in one
          calmer workspace.
        </p>
        <div className="content-chip-row">
          <span className="content-chip">3 translations</span>
          <span className="content-chip">Notes and bookmarks</span>
          <span className="content-chip">Related passages</span>
        </div>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Reading</p>
            <h2>{reference}</h2>
          </div>
          <div className="reader-prose">
            <p>{primaryText}</p>
          </div>
          <div className="content-actions">
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
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Comparison</p>
            <h2>Read across translations</h2>
          </div>
          <div className="content-stack">
            {comparison.map((item) => (
              <div key={item.version} className="content-card-note">
                <strong>{item.version}</strong>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="content-grid-three">
        <section className="content-card">
          <span className="content-badge">
            <BookMarked size={14} />
            Study actions
          </span>
          <h2>Capture the moment</h2>
          {signedIn ? (
            <div className="content-actions">
              <button type="button" className="button-secondary" onClick={() => void saveBookmark()}>
                Bookmark passage
              </button>
              <button type="button" className="button-secondary" onClick={() => void saveStudy()}>
                Log study session
              </button>
            </div>
          ) : (
            <p className="content-card-note">
              Sign in to save bookmarks, notes, and study activity.
            </p>
          )}
        </section>

        <section className="content-card">
          <span className="content-badge">
            <NotebookPen size={14} />
            Notes
          </span>
          <h2>Write what stands out</h2>
          {signedIn ? (
            <>
              <textarea
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
                className="minimal-textarea"
                rows={5}
                placeholder="Write an observation, question, or prayer..."
              />
              <div className="content-actions">
                <button type="button" className="button-primary" onClick={() => void saveNote()}>
                  Save note
                </button>
              </div>
            </>
          ) : (
            <p className="content-card-note">
              Sign in to save personal notes on this passage.
            </p>
          )}
        </section>

        <section className="content-card">
          <span className="content-badge">
            <Sparkles size={14} />
            Related passages
          </span>
          <h2>Keep exploring</h2>
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
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Your notes here</p>
            <h2>Saved reflections on this passage</h2>
          </div>
          {loading ? (
            <p className="content-card-note">Loading notes...</p>
          ) : notes.length > 0 ? (
            <div className="content-stack">
              {notes.map((note) => (
                <div key={note.id} className="content-card-note">
                  <strong>{note.noteType}</strong>
                  <p>{note.content}</p>
                </div>
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
            <p className="eyebrow">Saved state</p>
            <h2>What you have already captured</h2>
          </div>
          <div className="content-stack">
            <div className="content-card-note">
              <strong>Bookmarks</strong>
              <p>{bookmarks.length} saved item(s) for this reference.</p>
            </div>
            <div className="content-card-note">
              <strong>Study flow</strong>
              <p>
                Move from this passage into verse images, journaling, or a group
                prompt without losing the thread.
              </p>
            </div>
            <div className="content-card-note">
              <strong>Deeper tools</strong>
              <p>
                This is the foundation for future commentary, highlighting, and
                verse-by-verse layers.
              </p>
            </div>
          </div>
        </section>
      </section>

      {shareStatus ? <p className="share-status">{shareStatus}</p> : null}
    </main>
  );
}
