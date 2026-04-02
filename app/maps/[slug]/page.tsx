import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getBibleLocationBySlug,
  getBibleLocations,
  getJourneysForLocation,
  getRelatedCharactersForLocation,
} from "@/lib/bible-atlas";
import AtlasMapPanel from "../AtlasMapPanel";

export function generateStaticParams() {
  return getBibleLocations().map((location) => ({
    slug: location.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = getBibleLocationBySlug(slug);

  return {
    title: location ? `${location.name} | Bible Atlas` : "Bible Atlas",
    description: location?.summary ?? "Bible atlas entry",
  };
}

export default async function MapDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = getBibleLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const relatedCharacters = getRelatedCharactersForLocation(location);
  const journeys = getJourneysForLocation(location);

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Bible atlas</p>
        <h1>{location.name}</h1>
        <p className="content-lead">{location.summary}</p>
        <div className="content-chip-row">
          <span className="content-chip">{location.region}</span>
          <span className="content-chip">{location.era}</span>
        </div>
      </section>

      <section className="atlas-detail-grid">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Why it matters</p>
            <h2>Place this location in the biblical story</h2>
          </div>
          <div className="dictionary-definition">
            <strong>{location.name}</strong>
            <p>{location.significance}</p>
          </div>
        </section>

        <aside className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Study links</p>
            <h2>Keep moving</h2>
          </div>
          <div className="dictionary-link-list">
            <Link href="/maps" className="button-secondary">
              Back to atlas
            </Link>
            <Link href="/timeline" className="button-secondary">
              Open timeline
            </Link>
            <Link href={`/search?q=${encodeURIComponent(location.name)}`} className="button-secondary">
              Search this place
            </Link>
          </div>
        </aside>
      </section>

      <AtlasMapPanel locations={getBibleLocations()} highlightedSlug={location.slug} />

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Key references</p>
            <h2>Read this location in context</h2>
          </div>
          <div className="dictionary-link-list">
            {location.keyReferences.map((reference) => (
              <Link
                key={`${location.slug}-${reference}`}
                href={`/passage/${encodeURIComponent(reference)}`}
                className="button-secondary"
              >
                {reference}
              </Link>
            ))}
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Map profile</p>
            <h2>Visual and story anchors</h2>
          </div>
          <div className="content-stack">
            <div className="content-card-note">
              <strong>Map label</strong>
              <p>{location.mapLabel}</p>
            </div>
            <div className="content-card-note">
              <strong>Region and era</strong>
              <p>
                {location.region} · {location.era}
              </p>
            </div>
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Connected people</p>
            <h2>Characters tied to this place</h2>
          </div>
          <div className="content-stack">
            {relatedCharacters.map((character) => (
              <Link
                key={character.slug}
                href={`/characters/${character.slug}`}
                className="content-card-note"
              >
                <strong>{character.name}</strong>
                <p>{character.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      </section>

      {journeys.length > 0 ? (
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Atlas journeys</p>
            <h2>See how this location fits a larger movement</h2>
          </div>
          <div className="content-stack">
            {journeys.map((journey) => (
              <article key={journey.slug} className="content-card-note">
                <strong>{journey.title}</strong>
                <p>{journey.summary}</p>
                <p>{journey.focus}</p>
                <div className="content-chip-row">
                  {journey.stops.map((stop) => {
                    const stopLocation = getBibleLocationBySlug(stop);
                    return stopLocation ? (
                      <Link
                        key={`${journey.slug}-${stop}`}
                        href={`/maps/${stopLocation.slug}`}
                        className="content-chip"
                      >
                        {stopLocation.name}
                      </Link>
                    ) : null;
                  })}
                </div>
                <div className="dictionary-link-list">
                  {journey.keyReferences.slice(0, 3).map((reference) => (
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
      ) : null}
    </main>
  );
}
