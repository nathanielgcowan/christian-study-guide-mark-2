import Link from "next/link";
import { ArrowRight, BookOpenText, NotebookPen } from "lucide-react";
import { devotionals, getDailyDevotional } from "@/lib/devotionals";

export default async function DailyDevotionalsPage() {
  const today = new Date().toISOString().split("T")[0];
  const devotional = getDailyDevotional(today);

  if (!devotional) {
    return (
      <main id="main-content" className="page-shell devotional-shell">
        <section className="devotional-empty">
          <div className="devotional-empty-mark">Read</div>
          <h2>No devotional is available yet</h2>
          <p>Check back soon, or explore the full devotional archive instead.</p>
          <div className="devotional-actions">
            <Link href="/devotionals" className="button-primary">
              Open archive
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const recentDevotionals = devotionals
    .filter((entry) => entry.id !== devotional.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <main id="main-content" className="page-shell devotional-shell">
      <section className="devotional-hero">
        <p className="eyebrow">Today&apos;s devotional</p>
        <h1>{devotional.title}</h1>
        <p className="devotional-lead">
          A focused daily reading with Scripture, reflection, and prayer to help
          you start from God&apos;s Word before moving into the rest of your day.
        </p>

        <div className="devotional-toolbar">
          <div className="devotional-picker">
            <label className="minimal-label">Today&apos;s date</label>
            <div className="content-chip-row">
              <span className="content-chip">
                {new Date(devotional.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="devotional-toolbar-actions">
            <Link href="/devotionals" className="button-secondary">
              Full archive
            </Link>
            <Link href="/notifications" className="button-secondary">
              Email reminders
            </Link>
          </div>
        </div>
      </section>

      <section className="devotional-card devotional-card-featured">
        <div className="devotional-pill">Today&apos;s Reading</div>
        <div className="devotional-card-header">
          <div className="devotional-date">
            {new Date(devotional.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <h2>{devotional.title}</h2>

          <div className="devotional-verse-block">
            <blockquote className="devotional-verse">
              &ldquo;{devotional.verse.text}&rdquo;
            </blockquote>
            <cite className="devotional-citation">
              — {devotional.verse.reference}
            </cite>
          </div>
        </div>

        <div className="devotional-content">
          <section className="devotional-section">
            <h3>Devotional</h3>
            <div className="devotional-prose">
              {devotional.content
                .split("\n")
                .map(
                  (paragraph, index) =>
                    paragraph.trim() && <p key={index}>{paragraph.trim()}</p>,
                )}
            </div>
          </section>

          <section className="devotional-section">
            <h3>Reflection Questions</h3>
            <ul className="devotional-reflection-list">
              {devotional.reflection.map((question, index) => (
                <li key={question}>
                  <span className="devotional-reflection-mark">{index + 1}</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="devotional-section">
            <h3>Prayer</h3>
            <div className="devotional-prayer">{devotional.prayer}</div>
          </section>
        </div>

        <div className="devotional-actions">
          <Link
            href={`/passage/${encodeURIComponent(devotional.verse.reference)}`}
            className="button-primary"
          >
            <BookOpenText size={16} />
            Study this passage
          </Link>
          <Link href="/prayer-journal" className="button-secondary">
            <NotebookPen size={16} />
            Open prayer journal
          </Link>
          <Link
            href={`/share/verse?verse=${encodeURIComponent(devotional.verse.text)}&reference=${encodeURIComponent(devotional.verse.reference)}`}
            className="button-secondary"
          >
            Share verse
          </Link>
        </div>
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Keep the rhythm going</p>
          <h2>What to do next after today&apos;s devotional</h2>
        </div>
        <div className="content-grid-three">
          <article className="content-card">
            <h3 className="content-card-title">Read more slowly</h3>
            <p>
              Open the passage workspace to compare translations, save notes,
              and revisit related verses.
            </p>
            <Link
              href={`/passage/${encodeURIComponent(devotional.verse.reference)}`}
              className="button-secondary"
            >
              Open passage study
            </Link>
          </article>
          <article className="content-card">
            <h3 className="content-card-title">Respond in prayer</h3>
            <p>
              Carry one reflection or request into the prayer journal while it
              is still fresh.
            </p>
            <Link href="/prayer-journal" className="button-secondary">
              Prayer journal
            </Link>
          </article>
          <article className="content-card">
            <h3 className="content-card-title">Stay consistent</h3>
            <p>
              Add a reading plan and reminder flow so daily devotionals become a
              steady habit, not a one-off visit.
            </p>
            <Link href="/reading-plans" className="button-secondary">
              Reading plans
            </Link>
          </article>
        </div>
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Recent entries</p>
          <h2>Other devotionals you can read next</h2>
        </div>
        <div className="content-grid-three">
          {recentDevotionals.map((entry) => (
            <article key={entry.id} className="content-card">
              <div className="content-card-note">
                <strong>{entry.title}</strong>
                <p>
                  {new Date(entry.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p>{entry.verse.reference}</p>
              <Link href="/devotionals" className="button-secondary">
                Read in archive
                <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
