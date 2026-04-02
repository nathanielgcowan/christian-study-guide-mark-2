import Link from "next/link";
import { getChurchProfiles } from "@/lib/church-events";

export default async function ChurchesPage() {
  const churches = await getChurchProfiles();

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Church profiles</p>
        <h1>Custom spaces for ministries using the platform.</h1>
        <p className="content-lead">
          Each church profile can gather ministry identity, events, group
          rhythms, and key resources into one clearer home for the people it
          serves.
        </p>
      </section>

      <section className="content-grid-two">
        {churches.map((church) => (
          <article
            key={church.slug}
            className="content-card"
            style={{
              background: church.branding.surface,
              borderColor: church.branding.accentSoft,
            }}
          >
            <div className="content-chip-row">
              <span
                className="content-badge"
                style={{
                  background: church.branding.accent,
                  color: "#fff",
                }}
              >
                {church.branding.logoText}
              </span>
              <span className="content-badge">
                {church.city}, {church.state}
              </span>
              <span className="content-card-meta">{church.groupSlugs.length} ministry groups</span>
            </div>
            <h2 className="content-card-title">{church.name}</h2>
            <p>{church.tagline}</p>
            <div className="content-card-note">
              <strong>Ministry focus</strong>
              <p>{church.ministryFocus[0]}</p>
            </div>
            <div className="content-card-note">
              <strong>Featured announcement</strong>
              <p>{church.announcements[0]?.title ?? "No current announcement set."}</p>
            </div>
            <div className="content-actions">
              <Link href={`/churches/${church.slug}`} className="button-primary">
                Open church profile
              </Link>
              <Link href="/church-events" className="button-secondary">
                Browse events
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
