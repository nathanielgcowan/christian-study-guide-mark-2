import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getBibleCharacterBySlug,
  getBibleCharacters,
  getRelatedLocationsForCharacter,
} from "@/lib/bible-atlas";

export function generateStaticParams() {
  return getBibleCharacters().map((character) => ({
    slug: character.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const character = getBibleCharacterBySlug(slug);

  return {
    title: character ? `${character.name} | Bible Characters` : "Bible Characters",
    description: character?.summary ?? "Bible character profile",
  };
}

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const character = getBibleCharacterBySlug(slug);

  if (!character) {
    notFound();
  }

  const relatedLocations = getRelatedLocationsForCharacter(character);

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Bible characters</p>
        <h1>{character.name}</h1>
        <p className="content-lead">{character.summary}</p>
        <div className="content-chip-row">
          <span className="content-chip">{character.era}</span>
          {character.themes.map((theme) => (
            <span key={`${character.slug}-${theme}`} className="content-chip">
              {theme}
            </span>
          ))}
        </div>
      </section>

      <section className="atlas-detail-grid">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Why this person matters</p>
            <h2>Read the life in redemptive context</h2>
          </div>
          <div className="dictionary-definition">
            <strong>{character.name}</strong>
            <p>{character.significance}</p>
          </div>
        </section>

        <aside className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Study links</p>
            <h2>Keep exploring</h2>
          </div>
          <div className="dictionary-link-list">
            <Link href="/characters" className="button-secondary">
              Back to characters
            </Link>
            <Link href="/timeline" className="button-secondary">
              Open timeline
            </Link>
            <Link href={`/search?q=${encodeURIComponent(character.name)}`} className="button-secondary">
              Search this person
            </Link>
          </div>
        </aside>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Key references</p>
            <h2>Read major passages</h2>
          </div>
          <div className="dictionary-link-list">
            {character.keyReferences.map((reference) => (
              <Link
                key={`${character.slug}-${reference}`}
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
            <p className="eyebrow">Related places</p>
            <h2>Where this story unfolds</h2>
          </div>
          <div className="content-stack">
            {relatedLocations.map((location) => (
              <Link
                key={location.slug}
                href={`/maps/${location.slug}`}
                className="content-card-note"
              >
                <strong>{location.name}</strong>
                <p>{location.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
