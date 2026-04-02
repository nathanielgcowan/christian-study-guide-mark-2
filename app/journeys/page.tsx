import Link from "next/link";
import { getAtlasJourneys, getBibleLocationBySlug } from "@/lib/bible-atlas";

export default function JourneysPage() {
  const journeys = getAtlasJourneys();

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Atlas journeys</p>
        <h1>Follow larger biblical movements through places, passages, and story arcs.</h1>
        <p className="content-lead">
          These journey pages gather route stops, key readings, and narrative
          focus so readers can move through Scripture as a connected story.
        </p>
      </section>

      <section className="content-grid-two">
        {journeys.map((journey) => (
          <article key={journey.slug} className="content-card">
            <div className="content-chip-row">
              <span className="content-badge">{journey.era}</span>
              <span className="content-card-meta">{journey.stops.length} stops</span>
            </div>
            <h2 className="content-card-title">{journey.title}</h2>
            <p>{journey.summary}</p>
            <div className="content-chip-row">
              {journey.stops.map((stop) => {
                const location = getBibleLocationBySlug(stop);
                return location ? (
                  <span key={`${journey.slug}-${stop}`} className="content-chip">
                    {location.name}
                  </span>
                ) : null;
              })}
            </div>
            <div className="content-actions">
              <Link href={`/journeys/${journey.slug}`} className="button-primary">
                Open journey
              </Link>
              <Link href={`/passage/${encodeURIComponent(journey.keyReferences[0])}`} className="button-secondary">
                Read first passage
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
