import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAtlasJourneys,
  getBibleLocationBySlug,
} from "@/lib/bible-atlas";

function getJourneyBySlug(slug: string) {
  return getAtlasJourneys().find((journey) => journey.slug === slug) ?? null;
}

export function generateStaticParams() {
  return getAtlasJourneys().map((journey) => ({ slug: journey.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const journey = getJourneyBySlug(slug);

  return {
    title: journey ? `${journey.title} | Atlas Journeys` : "Atlas Journeys",
    description: journey?.summary ?? "Guided biblical journey",
  };
}

export default async function JourneyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const journey = getJourneyBySlug(slug);

  if (!journey) {
    notFound();
  }

  const stops = journey.stops
    .map((stop) => getBibleLocationBySlug(stop))
    .filter((stop): stop is NonNullable<ReturnType<typeof getBibleLocationBySlug>> => Boolean(stop));

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Atlas journey</p>
        <h1>{journey.title}</h1>
        <p className="content-lead">{journey.summary}</p>
        <div className="content-chip-row">
          <span className="content-chip">{journey.era}</span>
          <span className="content-chip">{journey.focus}</span>
        </div>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Narrative focus</p>
            <h2>How to read this movement</h2>
          </div>
          <div className="content-card-note">
            <strong>{journey.focus}</strong>
            <p>
              Use the stops and readings below to follow the storyline in order
              instead of treating each place as an isolated background note.
            </p>
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Reading sequence</p>
            <h2>Passages that trace the route</h2>
          </div>
          <div className="content-stack">
            {journey.keyReferences.map((reference, index) => (
              <div key={`${journey.slug}-${reference}`} className="content-card-note">
                <strong>
                  Step {index + 1}: {reference}
                </strong>
                <Link
                  href={`/passage/${encodeURIComponent(reference)}`}
                  className="button-secondary"
                >
                  Open passage
                </Link>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Route stops</p>
          <h2>Walk the journey location by location</h2>
        </div>
        <div className="content-grid-two">
          {stops.map((stop, index) => (
            <article key={`${journey.slug}-${stop.slug}`} className="content-card">
              <div className="content-chip-row">
                <span className="content-badge">Stop {index + 1}</span>
                <span className="content-card-meta">{stop.region}</span>
              </div>
              <h3 className="content-card-title">{stop.name}</h3>
              <p>{stop.summary}</p>
              <div className="content-card-note">
                <strong>Why it matters</strong>
                <p>{stop.significance}</p>
              </div>
              <div className="content-actions">
                <Link href={`/maps/${stop.slug}`} className="button-primary">
                  Open atlas entry
                </Link>
                <Link href={`/passage/${encodeURIComponent(stop.keyReferences[0])}`} className="button-secondary">
                  Read key passage
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
