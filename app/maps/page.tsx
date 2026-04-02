import Link from "next/link";
import { getAtlasJourneys, getBibleLocations, getBibleLocationBySlug } from "@/lib/bible-atlas";
import AtlasExplorer from "./AtlasExplorer";
import AtlasMapPanel from "./AtlasMapPanel";

export default function MapsPage() {
  const locations = getBibleLocations();
  const journeys = getAtlasJourneys();

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Bible atlas</p>
        <h1>Explore biblical places with context that supports real study.</h1>
        <p className="content-lead">
          Move beyond a placeholder map page and into a guided atlas of major
          biblical settings, from Sinai and Jerusalem to Rome and the Sea of
          Galilee. Each place links back into passages, people, and the larger
          storyline of Scripture.
        </p>
        <div className="content-chip-row">
          <span className="content-chip">{locations.length} locations</span>
          <span className="content-chip">{journeys.length} route diagrams</span>
          <span className="content-chip">Passage links</span>
          <span className="content-chip">People and place context</span>
        </div>
      </section>

      <section className="content-grid-three">
        <article className="content-stat">
          <span>Key regions</span>
          <strong>{new Set(locations.map((location) => location.region)).size}</strong>
        </article>
        <article className="content-stat">
          <span>Story eras</span>
          <strong>{new Set(locations.map((location) => location.era)).size}</strong>
        </article>
        <article className="content-stat">
          <span>Study handoff</span>
          <strong>Passage + timeline</strong>
        </article>
      </section>

      <AtlasMapPanel locations={locations} />

      <AtlasExplorer locations={locations} journeys={journeys} />

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Atlas journeys</p>
          <h2>Follow connected movements through the biblical story</h2>
        </div>
        <div className="content-grid-two">
          {journeys.map((journey) => (
            <article key={journey.slug} className="content-card">
              <div className="content-section-heading">
                <p className="eyebrow">{journey.era}</p>
                <h3 className="content-card-title">{journey.title}</h3>
              </div>
              <p>{journey.summary}</p>
              <p className="content-card-meta">{journey.focus}</p>
              <div className="atlas-route-diagram atlas-route-diagram-compact">
                {journey.stops.slice(0, 4).map((stop, index) => {
                  const location = getBibleLocationBySlug(stop);
                  return location ? (
                    <div key={`${journey.slug}-${stop}-compact`} className="atlas-route-step">
                      <span className="atlas-route-step-number">{index + 1}</span>
                      <div>
                        <strong>{location.name}</strong>
                        <p>{location.mapLabel}</p>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
              <div className="content-chip-row">
                {journey.stops.map((stop) => {
                  const location = getBibleLocationBySlug(stop);
                  return location ? (
                    <Link key={`${journey.slug}-${stop}`} href={`/maps/${location.slug}`} className="content-chip">
                      {location.name}
                    </Link>
                  ) : null;
                })}
              </div>
              <div className="dictionary-link-list">
                {journey.keyReferences.slice(0, 2).map((reference) => (
                  <Link
                    key={`${journey.slug}-${reference}`}
                    href={`/passage/${encodeURIComponent(reference)}`}
                    className="button-secondary"
                  >
                    {reference}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-card">
        <div className="content-section-heading">
          <p className="eyebrow">Keep exploring</p>
          <h2>Connect places to the rest of your study flow</h2>
        </div>
        <div className="dictionary-link-list">
          <Link href="/timeline" className="button-secondary">
            Open Bible timeline
          </Link>
          <Link href="/characters" className="button-secondary">
            Browse Bible characters
          </Link>
          <Link href="/bible/John/3" className="button-secondary">
            Read in the Bible reader
          </Link>
        </div>
      </section>
    </main>
  );
}
