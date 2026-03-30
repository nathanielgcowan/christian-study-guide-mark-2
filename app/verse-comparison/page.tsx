"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SUPPORTED_TRANSLATIONS } from "@/lib/bible";

interface ComparisonResult {
  reference: string;
  text: string;
  version: string;
}

export default function VerseComparisonPage() {
  const [signedIn, setSignedIn] = useState(false);
  const [reference, setReference] = useState("John 3:16");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [selectedTranslations, setSelectedTranslations] = useState<string[]>(
    SUPPORTED_TRANSLATIONS.map((translation) => translation.id),
  );
  const [noteContent, setNoteContent] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadSession() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSignedIn(Boolean(session));
    }

    void loadSession();
  }, []);

  useEffect(() => {
    void handleCompare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const comparisonSummary = useMemo(() => {
    if (results.length === 0) return null;
    return `${results.length} translations compared`;
  }, [results.length]);

  function toggleTranslation(id: string) {
    setSelectedTranslations((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }

  async function handleCompare(event?: React.FormEvent) {
    event?.preventDefault();
    if (!reference.trim() || selectedTranslations.length === 0) return;

    setLoading(true);
    setStatus(null);

    const response = await fetch("/api/bible/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        translations: selectedTranslations,
      }),
    });

    setLoading(false);

    if (response.ok) {
      const data = (await response.json()) as { results: ComparisonResult[] };
      setResults(data.results);

      if (signedIn) {
        await fetch("/api/user/studies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference,
            translation: selectedTranslations[0] ?? "web",
            timeSpentMinutes: 5,
            completed: true,
          }),
        });
      }
    } else {
      setResults([]);
      setStatus("Could not compare that reference.");
    }
  }

  async function saveBookmark() {
    const response = await fetch("/api/user/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        type: "verse comparison",
      }),
    });

    setStatus(response.ok ? "Reference bookmarked." : "Could not save bookmark.");
  }

  async function saveNote() {
    if (!noteContent.trim()) return;

    const response = await fetch("/api/user/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        content: noteContent,
        noteType: "note",
        tags: ["comparison"],
      }),
    });

    if (response.ok) {
      setNoteContent("");
      setStatus("Comparison note saved.");
    } else {
      setStatus("Could not save note.");
    }
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Verse comparison</p>
        <h1>Compare translations and capture study insights in one place.</h1>
        <p className="content-lead">
          Move from a single reference into multiple translations, then save a
          bookmark or note without losing the passage you are studying.
        </p>
        {comparisonSummary ? (
          <div className="content-chip-row">
            <span className="content-chip">{comparisonSummary}</span>
          </div>
        ) : null}
      </section>

      <section className="content-card">
        <form onSubmit={handleCompare} className="minimal-form-grid">
          <div>
            <label className="minimal-label">Reference</label>
            <input
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              className="minimal-input"
              placeholder="John 3:16"
            />
          </div>

          <div>
            <label className="minimal-label">Translations</label>
            <div className="content-chip-row">
              {SUPPORTED_TRANSLATIONS.map((translation) => (
                <button
                  key={translation.id}
                  type="button"
                  onClick={() => toggleTranslation(translation.id)}
                  className={
                    selectedTranslations.includes(translation.id)
                      ? "button-primary"
                      : "button-secondary"
                  }
                >
                  {translation.label}
                </button>
              ))}
            </div>
          </div>

          <div className="content-actions">
            <button type="submit" disabled={loading} className="button-primary">
              {loading ? "Comparing..." : "Compare verse"}
            </button>
            <Link href="/search" className="button-secondary">
              Search Scripture
            </Link>
          </div>
        </form>
      </section>

      <section className="content-grid-three">
        {results.map((result) => (
          <article key={result.version} className="content-card">
            <div className="content-chip-row">
              <span className="content-badge">{result.version}</span>
              <span className="content-card-meta">{result.reference}</span>
            </div>
            <p>{result.text}</p>
            <div className="content-actions">
              <Link
                href={`/share/verse?verse=${encodeURIComponent(result.text)}&reference=${encodeURIComponent(result.reference)}`}
                className="button-secondary"
              >
                Share
              </Link>
              <Link href="/user/verse-generator" className="button-secondary">
                Image
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Study actions</p>
            <h2>Keep the passage close</h2>
          </div>
          {signedIn ? (
            <div className="content-actions">
              <button onClick={() => void saveBookmark()} className="button-primary">
                Save bookmark
              </button>
              <Link href="/user/bookmarks" className="button-secondary">
                Open bookmarks
              </Link>
            </div>
          ) : (
            <div className="content-card-note">
              Sign in to save bookmarks, notes, and reading activity from the
              comparison view.
            </div>
          )}
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Quick note</p>
            <h2>Capture what stands out</h2>
          </div>
          {signedIn ? (
            <>
              <textarea
                value={noteContent}
                onChange={(event) => setNoteContent(event.target.value)}
                className="minimal-textarea"
                rows={6}
                placeholder="What difference stands out across these translations?"
              />
              <div className="content-actions">
                <button onClick={() => void saveNote()} className="button-primary">
                  Save note
                </button>
                <Link href="/journal" className="button-secondary">
                  Open journal
                </Link>
              </div>
            </>
          ) : (
            <div className="content-card-note">
              Sign in to save comparison notes to your study journal.
            </div>
          )}
        </section>
      </section>

      {status ? <p className="share-status">{status}</p> : null}
    </main>
  );
}
