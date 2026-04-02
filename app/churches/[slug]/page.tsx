import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getChurchEvents,
  getChurchProfileBySlug,
  getChurchProfiles,
  getChurchSpeakers,
} from "@/lib/church-events";
import { listGroups } from "@/lib/group-store";

export function generateStaticParams() {
  return [
    "grace-fellowship",
    "hope-city-church",
  ].map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const church = await getChurchProfileBySlug(slug);

  return {
    title: church ? `${church.name} | Church Profile` : "Church Profile",
    description: church?.summary ?? "Custom church profile for ministries using the platform.",
  };
}

export default async function ChurchProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const church = await getChurchProfileBySlug(slug);

  if (!church) {
    notFound();
  }

  const churches = await getChurchProfiles();
  const speakers = getChurchSpeakers(church.name);
  const events = getChurchEvents(church.name);
  const groups = listGroups().filter((group) => church.groupSlugs.includes(group.slug));
  const churchCount = churches.length;

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section
        className="content-hero"
        style={{
          background: church.branding.heroGradient,
          borderRadius: "32px",
          padding: "2rem",
        }}
      >
        <p className="eyebrow">Church profile</p>
        <div className="content-chip-row">
          <span
            className="content-chip"
            style={{
              background: church.branding.accent,
              color: "#fff",
              borderColor: church.branding.accent,
            }}
          >
            {church.branding.logoText}
          </span>
          <span className="content-chip">
            {church.city}, {church.state}
          </span>
          <span className="content-chip">{events.length} active events</span>
          <span className="content-chip">{groups.length} ministry groups</span>
          <span className="content-chip">{churchCount} active church profiles</span>
        </div>
        <h1>{church.name}</h1>
        <p className="content-lead">{church.summary}</p>
        <p>{church.tagline}</p>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">About this ministry</p>
            <h2>{church.tagline}</h2>
          </div>
          <div className="content-stack">
            <div className="content-card-note">
              <strong>Ministry focus</strong>
              <ul className="devotional-reflection-list">
                {church.ministryFocus.map((item, index) => (
                  <li key={item}>
                    <span className="devotional-reflection-mark">{index + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="content-card-note">
              <strong>Weekly rhythms</strong>
              <ul className="devotional-reflection-list">
                {church.weeklyRhythms.map((item, index) => (
                  <li key={item}>
                    <span className="devotional-reflection-mark">{index + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Leadership</p>
            <h2>People guiding the ministry flow</h2>
          </div>
          <div className="content-stack">
            {speakers.map((speaker) => (
              <article key={speaker.id} className="content-card-note">
                <strong>{speaker.name}</strong>
                <p>{speaker.role}</p>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="content-grid-two">
        <section
          className="content-card"
          style={{
            background: church.branding.surface,
            borderColor: church.branding.accentSoft,
          }}
        >
          <div className="content-section-heading">
            <p className="eyebrow">Brand controls</p>
            <h2>Ministry identity in the platform</h2>
          </div>
          <div className="content-grid-two">
            <div className="content-card-note">
              <strong>Logo mark</strong>
              <p>{church.branding.logoText}</p>
            </div>
            <div className="content-card-note">
              <strong>Accent color</strong>
              <p>{church.branding.accent}</p>
            </div>
            <div className="content-card-note">
              <strong>Surface tone</strong>
              <p>{church.branding.surface}</p>
            </div>
            <div className="content-card-note">
              <strong>Featured mood</strong>
              <p>Used across the church hero and featured ministry sections.</p>
            </div>
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Announcements</p>
            <h2>What this ministry wants people to see first</h2>
          </div>
          <div className="content-stack">
            {church.announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="content-card-note"
                style={{
                  borderColor: church.branding.accentSoft,
                  background: church.branding.surface,
                }}
              >
                <div className="content-chip-row">
                  <span
                    className="content-badge"
                    style={{
                      background: church.branding.accentSoft,
                    }}
                  >
                    {announcement.label}
                  </span>
                </div>
                <strong>{announcement.title}</strong>
                <p>{announcement.body}</p>
                <Link href={announcement.href} className="button-secondary">
                  {announcement.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Church events</p>
            <h2>Upcoming teaching and gathering flow</h2>
          </div>
          <div className="content-stack">
            {events.map((event) => (
              <article key={event.id} className="content-card-note">
                <strong>{event.title}</strong>
                <p>
                  {event.eventType} · {new Date(event.date).toLocaleDateString()}
                </p>
                <p>{event.primaryPassage}</p>
                <div className="content-actions">
                  <Link
                    href={`/sermon-notes?event=${encodeURIComponent(event.id)}`}
                    className="button-secondary"
                  >
                    Sermon companion
                  </Link>
                  <Link
                    href={`/passage/${encodeURIComponent(event.primaryPassage)}`}
                    className="button-secondary"
                  >
                    Study passage
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Ministry groups</p>
            <h2>Shared spaces for classes and discipleship</h2>
          </div>
          <div className="content-stack">
            {groups.map((group) => (
              <article key={group.slug} className="content-card-note">
                <strong>{group.title}</strong>
                <p>{group.description}</p>
                <p>{group.focus}</p>
                <Link href={`/groups/${group.slug}`} className="button-secondary">
                  Open group
                </Link>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Featured ministry tools</p>
          <h2>Use the rest of the platform in a church-shaped way</h2>
        </div>
        <div className="content-grid-three">
          {church.featuredResources.map((resource) => (
            <article
              key={resource.href}
              className="content-card"
              style={{
                borderColor: church.branding.accentSoft,
                background: church.branding.surface,
              }}
            >
              <span
                className="content-badge"
                style={{
                  background: church.branding.accentSoft,
                }}
              >
                {resource.ministryTag}
              </span>
              <h3 className="content-card-title">{resource.label}</h3>
              <p>{resource.description}</p>
              <Link href={resource.href} className="button-secondary">
                Open
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
