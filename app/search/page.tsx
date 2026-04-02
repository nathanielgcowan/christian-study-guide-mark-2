"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface BibleSearchResult {
  reference: string;
  text: string;
  version: string;
}

type SearchFilter =
  | "all"
  | "verses"
  | "notes"
  | "atlas"
  | "blog"
  | "topics"
  | "groups";

interface SmartSearchResult {
  id: string;
  title: string;
  type:
    | "dictionary"
    | "atlas"
    | "blog"
    | "content"
    | "note"
    | "bookmark"
    | "topic"
    | "group";
  href: string;
  excerpt: string;
  meta: string;
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

const searchFilters: Array<{ id: SearchFilter; label: string }> = [
  { id: "all", label: "Everything" },
  { id: "verses", label: "Verses" },
  { id: "notes", label: "Notes" },
  { id: "atlas", label: "Atlas" },
  { id: "blog", label: "Blog" },
  { id: "topics", label: "Topics" },
  { id: "groups", label: "Groups" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("love");
  const [filter, setFilter] = useState<SearchFilter>("all");
  const [loading, setLoading] = useState(false);
  const [bibleResults, setBibleResults] = useState<BibleSearchResult[]>([]);
  const [smartResults, setSmartResults] = useState<SmartSearchResult[]>([]);
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

  async function runSearch(nextQuery: string, nextFilter: SearchFilter = filter) {
    const trimmedQuery = nextQuery.trim();
    if (!trimmedQuery) return;

    setQuery(trimmedQuery);
    setLoading(true);
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: trimmedQuery, filter: nextFilter }),
    });

    setLoading(false);
    setSearched(true);

    if (response.ok) {
      const data = (await response.json()) as {
        bibleResults: BibleSearchResult[];
        smartResults: SmartSearchResult[];
      };
      setBibleResults(data.bibleResults);
      setSmartResults(data.smartResults);

      const nextRecentSearches = [
        trimmedQuery,
        ...recentSearches.filter((item) => item.toLowerCase() !== trimmedQuery.toLowerCase()),
      ].slice(0, 8);
      persistRecentSearches(nextRecentSearches);
    } else {
      setBibleResults([]);
      setSmartResults([]);
    }
  }

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    await runSearch(query, filter);
  }

  const smartResultsHeading = useMemo(() => {
    switch (filter) {
      case "notes":
        return "Notes and bookmarks";
      case "atlas":
        return "Atlas results";
      case "blog":
        return "Blog matches";
      case "topics":
        return "Topic study matches";
      case "groups":
        return "Group matches";
      default:
        return "Matches across the whole site";
    }
  }, [filter]);

  return (
    <main id="main-content" className="page-shell content-shell-narrow content-stack">
      <section className="content-hero">
        <p className="eyebrow">Scripture search</p>
        <h1>Search the site with clearer filters.</h1>
        <p className="content-lead">
          Search by verses, notes, atlas, blog, topics, or groups so you can
          narrow the result set before opening the next study surface.
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

          <div>
            <label className="minimal-label">Filter</label>
            <div className="content-chip-row">
              {searchFilters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={filter === item.id ? "button-primary button-small" : "button-secondary button-small"}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="content-actions">
            <button type="submit" className="button-primary" disabled={loading}>
              {loading ? "Searching..." : "Search"}
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
              onClick={() => void runSearch(item, filter)}
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
                onClick={() => void runSearch(item, filter)}
                className="button-secondary button-small"
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="content-stack">
        {searched && smartResults.length === 0 && bibleResults.length === 0 ? (
          <div className="content-card-note">
            No results came back for that search yet. Try a broader keyword or a
            different filter.
          </div>
        ) : null}

        {smartResults.length > 0 ? (
          <section className="content-section-card content-stack">
            <div className="content-section-heading">
              <p className="eyebrow">Filtered results</p>
              <h2>{smartResultsHeading}</h2>
            </div>
            <div className="content-grid-two">
              {smartResults.map((result) => (
                <article key={result.id} className="content-card">
                  <div className="content-chip-row">
                    <span className="content-badge">{result.type}</span>
                    <span className="content-card-meta">{result.meta}</span>
                  </div>
                  <h3 className="content-card-title">{result.title}</h3>
                  <p>{result.excerpt}</p>
                  <div className="content-actions">
                    <Link href={result.href} className="button-primary">
                      Open result
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {bibleResults.length > 0 ? (
          <section className="content-section-card content-stack">
            <div className="content-section-heading">
              <p className="eyebrow">Bible results</p>
              <h2>Passages matching your search</h2>
            </div>
            <div className="content-stack">
              {bibleResults.map((result) => (
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
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
