import Link from "next/link";
import { getBibleLocations } from "@/lib/bible-atlas";

export default function MapsPage() {
  const locations = getBibleLocations();

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
          <span className="content-chip">Passage links</span>
          <span className="content-chip">People and place context</span>
        </div>
      </section>

      <section className="content-grid-three">
        <article className="content-stat">
          <span>Key regions</span>
          <strong>8</strong>
        </article>
        <article className="content-stat">
          <span>Story eras</span>
          <strong>6</strong>
        </article>
        <article className="content-stat">
          <span>Study handoff</span>
          <strong>Passage + timeline</strong>
        </article>
      </section>

      <section className="atlas-grid">
        {locations.map((location) => (
          <article key={location.slug} className="content-card atlas-card">
            <div className="content-section-heading">
              <p className="eyebrow">{location.region}</p>
              <h2>{location.name}</h2>
            </div>
            <p className="content-card-meta">{location.era}</p>
            <p>{location.summary}</p>
            <div className="dictionary-chip-group">
              {location.relatedCharacters.slice(0, 3).map((person) => (
                <span key={`${location.slug}-${person}`} className="content-chip">
                  {person.replace(/-/g, " ")}
                </span>
              ))}
            </div>
            <div className="dictionary-link-list">
              <Link href={`/maps/${location.slug}`} className="button-secondary">
                Open atlas entry
              </Link>
              <Link href={`/passage/${encodeURIComponent(location.keyReferences[0])}`} className="button-secondary">
                Read key passage
              </Link>
            </div>
          </article>
        ))}
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
