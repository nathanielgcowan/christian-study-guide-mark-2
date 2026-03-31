import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getBiblicalDictionaryEntryBySlug,
  getRelatedDictionaryEntries,
  sortedBiblicalDictionaryEntries,
} from "@/lib/biblical-dictionary";

export function generateStaticParams() {
  return sortedBiblicalDictionaryEntries.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getBiblicalDictionaryEntryBySlug(slug);

  if (!entry) {
    return {
      title: "Dictionary entry",
    };
  }

  return {
    title: `${entry.term} | Biblical Dictionary`,
    description: entry.summary,
  };
}

export default async function DictionaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getBiblicalDictionaryEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  const relatedEntries = getRelatedDictionaryEntries(entry);

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero dictionary-hero">
        <p className="eyebrow">Biblical dictionary</p>
        <h1>{entry.term}</h1>
        <p className="content-lead">{entry.summary}</p>
        <div className="content-chip-row">
          <span className="content-chip">{entry.category}</span>
          <span className="content-chip">{entry.keyReferences.length} key references</span>
        </div>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Definition</p>
            <h2>Meaning</h2>
          </div>
          <div className="dictionary-definition">
            <strong>{entry.term}</strong>
            <p>{entry.definition}</p>
          </div>
          <div className="content-card-note">
            <strong>Why it matters</strong>
            <p>
              {entry.whyItMatters ??
                "This term helps connect doctrine, reading context, and personal study more clearly."}
            </p>
          </div>
        </section>

        <aside className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Study links</p>
            <h2>Keep exploring</h2>
          </div>
          <div className="dictionary-link-list">
            <Link href="/dictionary" className="button-secondary">
              Back to dictionary
            </Link>
            <Link href={`/search?q=${encodeURIComponent(entry.term)}`} className="button-secondary">
              Search this term
            </Link>
            <Link href="/journal" className="button-secondary">
              Capture notes
            </Link>
          </div>
        </aside>
      </section>

      <section className="content-card">
        <div className="content-section-heading">
          <p className="eyebrow">Key references</p>
          <h2>Read where this idea appears in Scripture</h2>
        </div>
        <div className="dictionary-link-list">
          {entry.keyReferences.map((reference) => (
            <Link
              key={`${entry.slug}-${reference}`}
              href={`/passage/${encodeURIComponent(reference)}`}
              className="button-secondary"
            >
              {reference}
            </Link>
          ))}
        </div>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Related terms</p>
            <h2>Connected dictionary vocabulary</h2>
          </div>
          <div className="dictionary-link-list">
            {entry.relatedTerms.map((term) => (
              <Link
                key={`${entry.slug}-${term}`}
                href={`/dictionary/${encodeURIComponent(term.toLowerCase().replace(/\s+/g, "-"))}`}
                className="button-secondary"
              >
                {term}
              </Link>
            ))}
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">You may also want</p>
            <h2>More lexicon entries nearby</h2>
          </div>
          <div className="content-stack">
            {relatedEntries.map((related) => (
              <Link
                key={related.slug}
                href={`/dictionary/${related.slug}`}
                className="content-card-note"
              >
                <strong>{related.term}</strong>
                <p>{related.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
