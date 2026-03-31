import Link from "next/link";
import { getBibleCharacters } from "@/lib/bible-atlas";

export default function CharactersPage() {
  const characters = getBibleCharacters();

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Bible characters</p>
        <h1>Study major people in Scripture without losing passage context.</h1>
        <p className="content-lead">
          Browse key biblical figures with concise summaries, major references,
          themes, and links into the atlas, passage study, and timeline tools.
        </p>
        <div className="content-chip-row">
          <span className="content-chip">{characters.length} character profiles</span>
          <span className="content-chip">Themes and passages</span>
          <span className="content-chip">Atlas connections</span>
        </div>
      </section>

      <section className="character-grid">
        {characters.map((character) => (
          <article key={character.slug} className="content-card character-card">
            <div className="content-section-heading">
              <p className="eyebrow">{character.era}</p>
              <h2>{character.name}</h2>
            </div>
            <p>{character.summary}</p>
            <div className="dictionary-chip-group">
              {character.themes.map((theme) => (
                <span key={`${character.slug}-${theme}`} className="content-chip">
                  {theme}
                </span>
              ))}
            </div>
            <div className="dictionary-link-list">
              <Link href={`/characters/${character.slug}`} className="button-secondary">
                Open profile
              </Link>
              <Link href={`/passage/${encodeURIComponent(character.keyReferences[0])}`} className="button-secondary">
                Read key passage
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
