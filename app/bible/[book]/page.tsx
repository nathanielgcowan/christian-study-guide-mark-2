import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BIBLE_BOOKS, findBibleBook, getDefaultBibleReference } from "@/lib/bible";
import { getBookContext, getChapterContext } from "@/lib/bible-context";

export function generateStaticParams() {
  return BIBLE_BOOKS.map((entry) => ({
    book: entry.name,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ book: string }>;
}): Promise<Metadata> {
  const { book } = await params;
  const canonicalBook = findBibleBook(decodeURIComponent(book))?.name;

  if (!canonicalBook) {
    return {
      title: "Bible book",
    };
  }

  const context = getBookContext(canonicalBook);

  return {
    title: `${canonicalBook} | Bible Book Introduction`,
    description: context.summary,
  };
}

export default async function BibleBookPage({
  params,
}: {
  params: Promise<{ book: string }>;
}) {
  const { book } = await params;
  const canonicalBook = findBibleBook(decodeURIComponent(book))?.name;

  if (!canonicalBook) {
    notFound();
  }

  const context = getBookContext(canonicalBook);
  const openingChapter = getChapterContext(canonicalBook, 1);
  const middleChapter = getChapterContext(
    canonicalBook,
    Math.max(1, Math.ceil((findBibleBook(canonicalBook)?.chapters ?? 1) / 2)),
  );
  const defaultReference = getDefaultBibleReference();

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Book introduction</p>
        <h1>{canonicalBook}</h1>
        <p className="content-lead">{context.summary}</p>
        <div className="content-chip-row">
          <span className="content-chip">{context.testament}</span>
          <span className="content-chip">{context.era}</span>
          <span className="content-chip">{context.themes.length} major themes</span>
        </div>
      </section>

      <section className="content-grid-three">
        <article className="content-stat">
          <span>Author</span>
          <strong>{context.author}</strong>
        </article>
        <article className="content-stat">
          <span>Audience</span>
          <strong>{context.audience}</strong>
        </article>
        <article className="content-stat">
          <span>Approximate date</span>
          <strong>{context.approximateDate}</strong>
        </article>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Overview</p>
            <h2>How to enter this book well</h2>
          </div>
          <div className="dictionary-definition">
            <strong>Setting</strong>
            <p>{context.setting}</p>
          </div>
          <div className="content-card-note">
            <strong>Why read it</strong>
            <p>{context.whyReadIt}</p>
          </div>
          <div className="dictionary-chip-group">
            {context.themes.map((theme) => (
              <span key={`${canonicalBook}-${theme}`} className="content-chip">
                {theme}
              </span>
            ))}
          </div>
        </section>

        <aside className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Start reading</p>
            <h2>Open the book in context</h2>
          </div>
          <div className="dictionary-link-list">
            <Link href={`/bible/${encodeURIComponent(canonicalBook)}/1`} className="button-primary">
              Read chapter 1
            </Link>
            <Link href={`/passage/${encodeURIComponent(`${canonicalBook} 1`)}`} className="button-secondary">
              Open passage workspace
            </Link>
            <Link
              href={
                canonicalBook === defaultReference.book
                  ? `/bible/${encodeURIComponent(defaultReference.book)}/${defaultReference.chapter}`
                  : "/bible"
              }
              className="button-secondary"
            >
              Open Bible reader
            </Link>
          </div>
        </aside>
      </section>

      <section className="content-card">
        <div className="content-section-heading">
          <p className="eyebrow">Outline</p>
          <h2>Major movements in {canonicalBook}</h2>
        </div>
        <div className="content-stack">
          {context.outline.map((item) => (
            <article key={`${canonicalBook}-${item}`} className="content-card-note">
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Opening chapter</p>
            <h2>{openingChapter.title}</h2>
          </div>
          <p className="content-card-note">{openingChapter.summary}</p>
          <div className="content-stack">
            {openingChapter.readingFocus.map((item) => (
              <article key={`${canonicalBook}-opening-${item}`} className="content-card-note">
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Mid-book guidance</p>
            <h2>{middleChapter.title}</h2>
          </div>
          <p className="content-card-note">{middleChapter.summary}</p>
          <div className="content-stack">
            {middleChapter.readingFocus.map((item) => (
              <article key={`${canonicalBook}-middle-${item}`} className="content-card-note">
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
