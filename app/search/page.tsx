"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SearchResult {
  reference: string;
  text: string;
  version: string;
}

const SEARCH_HISTORY_KEY = "csg-search-history";
const suggestedSearches = [
  "grace",
  "faith",
  "prayer",
  "hope",
  "forgiveness",
  "wisdom",
];

export default function SearchPage() {
  const [query, setQuery] = useState("love");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SEARCH_HISTORY_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored) as unknown;
      if (Array.isArray(parsed)) {
        setRecentSearches(
          parsed.filter((item): item is string => typeof item === "string").slice(0, 8),
        );
      }
    } catch {}
  }, []);

  function persistRecentSearches(nextSearches: string[]) {
    setRecentSearches(nextSearches);
    window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(nextSearches));
  }

  async function runSearch(nextQuery: string) {
    const trimmedQuery = nextQuery.trim();
    if (!trimmedQuery) return;

    setQuery(trimmedQuery);
    setLoading(true);
    const response = await fetch("/api/bible/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: trimmedQuery }),
    });

    setLoading(false);
    setSearched(true);

    if (response.ok) {
      const data = (await response.json()) as { results: SearchResult[] };
      setResults(data.results);

      const nextRecentSearches = [
        trimmedQuery,
        ...recentSearches.filter((item) => item.toLowerCase() !== trimmedQuery.toLowerCase()),
      ].slice(0, 8);
      persistRecentSearches(nextRecentSearches);
    } else {
      setResults([]);
    }
  }

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    await runSearch(query);
  }

  return (
    <main id="main-content" className="page-shell content-shell-narrow content-stack">
      <section className="content-hero">
        <p className="eyebrow">Scripture search</p>
        <h1>Search Scripture and move straight into study.</h1>
        <p className="content-lead">
          Use a keyword or phrase to surface passages, then carry what you find
          into bookmarks, notes, prayer, or verse images.
        </p>
      </section>

      <section className="content-card">
        <form onSubmit={handleSearch} className="minimal-form-grid">
          <div>
            <label className="minimal-label">Search query</label>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="minimal-input"
              placeholder="faith, grace, prayer..."
            />
          </div>

          <div className="content-actions">
            <button type="submit" className="button-primary" disabled={loading}>
              {loading ? "Searching..." : "Search Scripture"}
            </button>
            <Link href="/journal" className="button-secondary">
              Open notes
            </Link>
          </div>
        </form>
      </section>

      <section className="content-card">
        <div className="content-section-heading">
          <p className="eyebrow">Suggestions</p>
          <h2>Start with a common theme</h2>
        </div>
        <div className="content-chip-row">
          {suggestedSearches.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => void runSearch(item)}
              className="button-secondary button-small"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {recentSearches.length > 0 ? (
        <section className="content-card">
          <div className="content-toolbar">
            <div className="content-section-heading">
              <p className="eyebrow">Recent</p>
              <h2>Your recent searches</h2>
            </div>
            <button
              type="button"
              onClick={() => persistRecentSearches([])}
              className="button-secondary button-small"
            >
              Clear history
            </button>
          </div>
          <div className="content-chip-row">
            {recentSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => void runSearch(item)}
                className="button-secondary button-small"
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="content-stack">
        {searched && results.length === 0 ? (
          <div className="content-card-note">
            No results came back for that search yet. Try a broader keyword.
          </div>
        ) : null}

        {results.map((result) => (
          <article key={`${result.reference}-${result.text}`} className="content-card">
            <div className="content-chip-row">
              <span className="content-badge">{result.version}</span>
              <span className="content-card-meta">{result.reference}</span>
            </div>
            <p>{result.text}</p>
            <div className="content-actions">
              <Link
                href={`/passage/${encodeURIComponent(result.reference)}`}
                className="button-primary"
              >
                Study passage
              </Link>
              <Link
                href={`/share/verse?verse=${encodeURIComponent(result.text)}&reference=${encodeURIComponent(result.reference)}`}
                className="button-secondary"
              >
                Share verse
              </Link>
              <Link href="/user/verse-generator" className="button-secondary">
                Create image
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
