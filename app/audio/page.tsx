import Link from "next/link";
import { Headphones, Mic2, Radio } from "lucide-react";

const audioModes = [
  {
    title: "Listen along with your reading plan",
    copy:
      "Match Scripture listening to the same rhythm as your reading target so consistency feels easier.",
    icon: Headphones,
  },
  {
    title: "Short guided reflections",
    copy:
      "Add brief audio devotionals and prayer prompts for mornings, walks, or commutes.",
    icon: Mic2,
  },
  {
    title: "Curated teaching streams",
    copy:
      "Surface sermon-style teaching, topical audio, and passage explainers in one quieter library.",
    icon: Radio,
  },
];

export default function AudioPage() {
  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Audio</p>
        <h1>Bring Scripture and reflection into the moments when reading is harder.</h1>
        <p className="content-lead">
          Audio is the next layer for commutes, walks, chores, and quiet prayer
          time. The goal is not more noise, but a gentler way to stay close to
          the Word.
        </p>
      </section>

      <section className="content-grid-three">
        {audioModes.map(({ title, copy, icon: Icon }) => (
          <article key={title} className="content-card">
            <span className="content-badge">
              <Icon size={14} />
              Audio mode
            </span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="content-card">
        <div className="content-section-heading">
          <p className="eyebrow">Next best moves</p>
          <h2>Prepare the app for listening-first study.</h2>
        </div>
        <div className="content-actions">
          <Link href="/reading-plans" className="button-secondary">
            Reading plans
          </Link>
          <Link href="/notifications" className="button-secondary">
            Reminder flow
          </Link>
          <Link href="/dashboard" className="button-primary">
            Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
