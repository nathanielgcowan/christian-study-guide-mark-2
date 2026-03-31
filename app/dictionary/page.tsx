"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  biblicalDictionaryEntries,
  findBiblicalDictionaryEntry,
  sortedBiblicalDictionaryEntries,
} from "@/lib/biblical-dictionary";

const categoryLabels = {
  person: "People",
  place: "Places",
  theme: "Themes",
  practice: "Practices",
  theology: "Theology",
} as const;

export default function DictionaryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<keyof typeof categoryLabels | "all">("all");
  const [letter, setLetter] = useState<string>("all");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const alphabet = useMemo(
    () =>
      Array.from(
        new Set(
          sortedBiblicalDictionaryEntries.map((entry) =>
            entry.term.charAt(0).toUpperCase(),
          ),
        ),
      ),
    [],
  );

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sortedBiblicalDictionaryEntries.filter((entry) => {
      const matchesCategory = category === "all" || entry.category === category;
      const matchesLetter =
        letter === "all" || entry.term.charAt(0).toUpperCase() === letter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        entry.term.toLowerCase().includes(normalizedQuery) ||
        entry.summary.toLowerCase().includes(normalizedQuery) ||
        entry.definition.toLowerCase().includes(normalizedQuery) ||
        entry.relatedTerms.some((term) => term.toLowerCase().includes(normalizedQuery)) ||
        (entry.aliases ?? []).some((term) => term.toLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesLetter && matchesQuery;
    });
  }, [category, letter, query]);

  const quickAnswer = useMemo(() => {
    const normalizedQuery = submittedQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return null;
    }

    return findBiblicalDictionaryEntry(normalizedQuery);
  }, [submittedQuery]);

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero dictionary-hero">
        <p className="eyebrow">Biblical dictionary</p>
        <h1>Look up biblical words, places, doctrines, and practices in one study shelf.</h1>
        <p className="content-lead">
          Use the dictionary to understand important Bible terms more clearly,
          then move straight into related passages, study tools, and your own notes.
        </p>
      </section>

      <form
        className="content-card dictionary-toolbar"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmittedQuery(query.trim());
        }}
      >
        <div>
          <label className="minimal-label" htmlFor="dictionary-search">Search terms</label>
          <input
            id="dictionary-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="minimal-input"
            placeholder="Search grace, Jerusalem, covenant, holiness..."
          />
        </div>
        <div>
          <label className="minimal-label" htmlFor="dictionary-category">Category</label>
          <select
            id="dictionary-category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as keyof typeof categoryLabels | "all")
            }
            className="minimal-select"
          >
            <option value="all">All entries</option>
            <option value="theology">Theology</option>
            <option value="theme">Themes</option>
            <option value="practice">Practices</option>
            <option value="place">Places</option>
            <option value="person">People</option>
          </select>
        </div>
      </form>

      {submittedQuery ? (
        <section className="content-card dictionary-answer">
          <div className="content-section-heading">
            <p className="eyebrow">Quick answer</p>
            <h2>{submittedQuery}</h2>
          </div>
          {quickAnswer ? (
            <>
              <div className="dictionary-definition">
                <strong>
                  <Link href={`/dictionary/${quickAnswer.slug}`}>{quickAnswer.term}</Link>
                </strong>
                <p>{quickAnswer.definition}</p>
              </div>
              <p className="content-card-note">{quickAnswer.summary}</p>
            </>
          ) : (
            <p className="content-card-note">
              No dictionary answer matched that term yet. Try a broader biblical word.
            </p>
          )}
        </section>
      ) : null}

      <section className="content-grid-three">
        <article className="content-stat">
          <span>Total entries</span>
          <strong>{biblicalDictionaryEntries.length}</strong>
        </article>
        <article className="content-stat">
          <span>Visible now</span>
          <strong>{filteredEntries.length}</strong>
        </article>
        <article className="content-stat">
          <span>Study handoff</span>
          <strong>Built in</strong>
        </article>
      </section>

      <section className="content-card">
        <div className="content-section-heading">
          <p className="eyebrow">Browse by letter</p>
          <h2>Find terms alphabetically</h2>
        </div>
        <div className="dictionary-chip-group">
          <button
            type="button"
            className={letter === "all" ? "button-primary button-small" : "button-secondary button-small"}
            onClick={() => setLetter("all")}
          >
            All
          </button>
          {alphabet.map((entryLetter) => (
            <button
              key={entryLetter}
              type="button"
              className={letter === entryLetter ? "button-primary button-small" : "button-secondary button-small"}
              onClick={() => setLetter(entryLetter)}
            >
              {entryLetter}
            </button>
          ))}
        </div>
      </section>

      <section className="content-grid-three">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <article key={key} className="content-card dictionary-summary-card">
            <div className="content-section-heading">
              <p className="eyebrow">{label}</p>
              <h2>
                {
                  biblicalDictionaryEntries.filter((entry) => entry.category === key)
                    .length
                }
              </h2>
            </div>
            <p className="content-card-note">
              {
                biblicalDictionaryEntries
                  .filter((entry) => entry.category === key)
                  .slice(0, 3)
                  .map((entry) => entry.term)
                  .join(", ")
              }
            </p>
          </article>
        ))}
      </section>

      <section className="dictionary-grid">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <article key={entry.slug} className="content-card dictionary-entry">
              <div className="content-section-heading">
                <p className="eyebrow">{categoryLabels[entry.category]}</p>
                <h2>
                  <Link href={`/dictionary/${entry.slug}`}>{entry.term}</Link>
                </h2>
              </div>

              <div className="dictionary-definition">
                <strong>Definition</strong>
                <p>{entry.definition}</p>
              </div>

              <p className="content-card-note">{entry.summary}</p>

              <div className="content-card-note">
                <strong>Why it matters</strong>
                <p>
                  {entry.whyItMatters ??
                    "This term helps connect doctrine, reading context, and personal study more clearly."}
                </p>
              </div>

              <div className="dictionary-chip-group">
                {entry.relatedTerms.map((term) => (
                  <span key={`${entry.slug}-${term}`} className="content-chip">
                    {term}
                  </span>
                ))}
              </div>

              <div className="content-stack">
                <strong>Key references</strong>
                <div className="dictionary-link-list">
                  {entry.keyReferences.map((item) => (
                    <Link
                      key={`${entry.slug}-${item}`}
                      href={`/passage/${encodeURIComponent(item)}`}
                      className="button-secondary"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="dictionary-link-list">
                <Link
                  href={`/search?q=${encodeURIComponent(entry.term)}`}
                  className="button-secondary"
                >
                  Search this term
                </Link>
                <Link href="/journal" className="button-secondary">
                  Capture notes
                </Link>
              </div>
            </article>
          ))
        ) : (
          <article className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">No matches</p>
              <h2>No dictionary entries match that search yet.</h2>
            </div>
            <p className="content-card-note">
              Try a broader keyword like grace, covenant, temple, kingdom, or spirit.
            </p>
          </article>
        )}
      </section>
    </main>
  );
}
