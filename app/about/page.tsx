import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about Christian Study Guide, why it exists, and the kind of Bible reading and spiritual growth experience it is designed to support.",
};

const pillars = [
  {
    title: "Scripture First",
    body:
      "The heart of Christian Study Guide is helping people stay close to the biblical text. We want the site to make reading, revisiting, and responding to Scripture feel simpler and more natural.",
  },
  {
    title: "Steady Growth",
    body:
      "Spiritual growth is rarely built on intensity alone. We are designing for consistency, so daily reading, notes, prayer, memory, and reflection feel sustainable over time.",
  },
  {
    title: "Connected Study",
    body:
      "Bible reading becomes richer when passages, people, places, timelines, notes, and prayer are not scattered across unrelated tools. This site is meant to gather those pieces into one calmer flow.",
  },
];

const values = [
  "A welcoming experience for new believers, long-time Christians, and curious readers alike.",
  "Tools that support reflection and formation, not just information gathering.",
  "A product direction that values clarity, reverence, and usability over noise.",
];

export default function AboutPage() {
  return (
    <main id="main-content" className="page-shell content-shell-narrow content-stack">
      <section className="content-hero">
        <p className="eyebrow">About</p>
        <h1>About Christian Study Guide</h1>
        <p className="content-lead">
          Christian Study Guide exists to make Bible reading, prayer, and spiritual
          growth feel more grounded, connected, and easier to return to each day.
        </p>
      </section>

      <section className="content-section-card content-stack">
        <article className="content-card">
          <h2 className="content-card-title">Why this site exists</h2>
          <p>
            Many Bible tools are strong in one area but fragmented in practice.
            Reading happens in one place, notes in another, prayer somewhere else,
            and study context often feels disconnected from everyday use. Christian
            Study Guide is being built to bring those pieces together in a more
            thoughtful and spiritually useful way.
          </p>
        </article>

        <article className="content-card">
          <h2 className="content-card-title">What we are building toward</h2>
          <p>
            The goal is a study experience where Scripture stays central while the
            surrounding tools actually help people keep going. That includes Bible
            reading, passage study, dictionary and atlas context, reading plans,
            prayer follow-up, journaling, memorization, and a dashboard that helps
            users continue where they left off.
          </p>
        </article>

        <section className="content-grid-three">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="content-card">
              <h2 className="content-card-title">{pillar.title}</h2>
              <p>{pillar.body}</p>
            </article>
          ))}
        </section>

        <article className="content-card">
          <h2 className="content-card-title">What matters to us</h2>
          <div className="content-stack">
            {values.map((value) => (
              <div key={value} className="content-card-note">
                <p>{value}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="content-card">
          <h2 className="content-card-title">Keep exploring</h2>
          <p>
            If you want to see the heart of the experience quickly, start with the
            Bible reader, dashboard, atlas, or reading plans.
          </p>
          <div className="content-actions">
            <Link href="/bible" className="button-primary">
              Open Bible reader
            </Link>
            <Link href="/dashboard" className="button-secondary">
              View dashboard
            </Link>
            <Link href="/maps" className="button-secondary">
              Explore atlas
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
