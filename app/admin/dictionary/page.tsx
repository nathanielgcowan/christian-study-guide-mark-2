"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { biblicalDictionaryEntries } from "@/lib/biblical-dictionary";

export default function AdminDictionaryPage() {
  const [query, setQuery] = useState("");

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return biblicalDictionaryEntries;
    }

    return biblicalDictionaryEntries.filter((entry) => {
      return (
        entry.term.toLowerCase().includes(normalizedQuery) ||
        entry.slug.toLowerCase().includes(normalizedQuery) ||
        entry.category.toLowerCase().includes(normalizedQuery) ||
        entry.definition.toLowerCase().includes(normalizedQuery) ||
        entry.relatedTerms.some((term) => term.toLowerCase().includes(normalizedQuery)) ||
        (entry.aliases ?? []).some((alias) => alias.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [query]);

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Admin dictionary</p>
        <h1>Review every dictionary term in one editorial inventory.</h1>
        <p className="content-lead">
          This admin view lists the full biblical dictionary vocabulary, with
          term names, categories, slugs, aliases, and related references for
          quick editorial review.
        </p>
        <div className="content-actions">
          <Link href="/admin/content" className="button-secondary">
            Back to CMS
          </Link>
          <Link href="/dictionary" className="button-secondary">
            Open public dictionary
          </Link>
        </div>
      </section>

      <section className="content-grid-three">
        <article className="content-stat">
          <span>Total terms</span>
          <strong>{biblicalDictionaryEntries.length}</strong>
        </article>
        <article className="content-stat">
          <span>Visible now</span>
          <strong>{filteredEntries.length}</strong>
        </article>
        <article className="content-stat">
          <span>Aliased terms</span>
          <strong>{biblicalDictionaryEntries.filter((entry) => (entry.aliases ?? []).length > 0).length}</strong>
        </article>
      </section>

      <section className="content-card">
        <div className="content-section-heading">
          <p className="eyebrow">Search inventory</p>
          <h2>Find terms quickly</h2>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="minimal-input"
          placeholder="Search term, slug, alias, category, or definition..."
        />
      </section>

      <section className="minimal-table-wrap">
        <table className="minimal-table">
          <thead>
            <tr>
              <th>Term</th>
              <th>Category</th>
              <th>Slug</th>
              <th>Aliases</th>
              <th>References</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => (
              <tr key={entry.slug}>
                <td>
                  <Link href={`/dictionary/${entry.slug}`} className="minimal-link">
                    {entry.term}
                  </Link>
                </td>
                <td>{entry.category}</td>
                <td>{entry.slug}</td>
                <td>{(entry.aliases ?? []).join(", ") || "None"}</td>
                <td>{entry.keyReferences.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
