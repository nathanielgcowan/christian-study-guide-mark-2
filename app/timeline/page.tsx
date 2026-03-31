import Link from "next/link";
import { getBibleTimelineEvents, getBookContext } from "@/lib/bible-context";

const featuredBooks = ["Genesis", "Exodus", "Psalms", "Isaiah", "John", "Acts", "Romans", "Revelation"];

export default function TimelinePage() {
  const timeline = getBibleTimelineEvents();
  const books = featuredBooks.map((book) => getBookContext(book));

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero timeline-hero">
        <p className="eyebrow">Bible timeline</p>
        <h1>See where a passage sits in the story of Scripture.</h1>
        <p className="content-lead">
          This context layer helps readers place books and passages inside the
          larger biblical storyline, from creation and covenant to Christ,
          church mission, and new creation.
        </p>
      </section>

      <section className="timeline-grid">
        {timeline.map((event) => (
          <article key={event.label} className="content-card timeline-card">
            <div className="content-section-heading">
              <p className="eyebrow">{event.era}</p>
              <h2>{event.label}</h2>
            </div>
            <p className="content-card-meta">{event.approximateDate}</p>
            <p className="content-card-note">{event.summary}</p>
            <div className="dictionary-link-list">
              {event.references.map((reference) => (
                <Link
                  key={`${event.label}-${reference}`}
                  href={`/passage/${encodeURIComponent(reference)}`}
                  className="button-secondary"
                >
                  {reference}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="content-card">
        <div className="content-section-heading">
          <p className="eyebrow">Book context</p>
          <h2>Quick context for key Bible books</h2>
        </div>
        <div className="timeline-book-grid">
          {books.map((book) => (
            <article key={book.book} className="content-card-note timeline-book-card">
              <strong>{book.book}</strong>
              <p>{book.summary}</p>
              <p>{book.era} · {book.approximateDate}</p>
              <div className="dictionary-chip-group">
                {book.themes.map((theme) => (
                  <span key={`${book.book}-${theme}`} className="content-chip">
                    {theme}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
