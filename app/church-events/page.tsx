import Link from "next/link";
import { churchEvents, getSpeakerById } from "@/lib/church-events";

export default function ChurchEventsPage() {
  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Church events</p>
        <h1>Keep sermons, gatherings, and follow-up study connected.</h1>
        <p className="content-lead">
          Browse upcoming teaching moments, see the main passage for each one,
          and move straight into sermon notes or deeper passage study.
        </p>
        <div className="content-actions">
          <Link href="/churches" className="button-secondary">
            Open church profiles
          </Link>
        </div>
      </section>

      <section className="content-grid-two">
        {churchEvents.map((event) => {
          const speaker = getSpeakerById(event.speakerId);

          return (
            <article key={event.id} className="content-card">
              <div className="content-chip-row">
                <span className="content-badge">{event.eventType}</span>
                <span className="content-card-meta">
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
              <h2 className="content-card-title">{event.title}</h2>
              <p>
                {event.church}
                {speaker ? ` · ${speaker.name}` : ""}
              </p>
              <div className="content-card-note">
                <strong>{event.primaryPassage}</strong>
                <p>{event.summary}</p>
              </div>
              {event.supportingPassages.length > 0 ? (
                <div className="content-chip-row">
                  {event.supportingPassages.map((reference) => (
                    <Link
                      key={reference}
                      href={`/passage/${encodeURIComponent(reference)}`}
                      className="content-chip"
                    >
                      {reference}
                    </Link>
                  ))}
                </div>
              ) : null}
              <div className="content-actions">
                <Link
                  href={`/sermon-notes?event=${encodeURIComponent(event.id)}`}
                  className="button-primary"
                >
                  Open sermon companion
                </Link>
                <Link
                  href={`/passage/${encodeURIComponent(event.primaryPassage)}`}
                  className="button-secondary"
                >
                  Study passage
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
