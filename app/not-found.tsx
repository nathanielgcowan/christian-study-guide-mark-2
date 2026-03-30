import Link from "next/link";
import { ArrowLeft, Compass, Home, Search } from "lucide-react";

const destinations = [
  {
    href: "/dashboard",
    title: "Go to dashboard",
    copy: "Jump back into your reading rhythm, saved passages, and study tools.",
    icon: Compass,
  },
  {
    href: "/reading-plans",
    title: "Browse reading plans",
    copy: "Start from a guided path if you were looking for a study destination.",
    icon: Search,
  },
  {
    href: "/",
    title: "Return home",
    copy: "Head back to the main landing page and navigate from the primary hub.",
    icon: Home,
  },
];

export default function NotFound() {
  return (
    <main id="main-content" className="page-shell not-found-shell">
      <section className="not-found-panel">
        <div className="not-found-copy">
          <p className="eyebrow">404</p>
          <h1>This page is not here, but you are not lost.</h1>
          <p className="not-found-lead">
            The link may be outdated, the page may have moved, or the address
            may have been typed incorrectly. A few better paths are below.
          </p>
          <div className="not-found-actions">
            <Link href="/" className="button-primary">
              Back to home
            </Link>
            <Link href="/dashboard" className="button-secondary">
              Open dashboard
            </Link>
          </div>
          <Link href="/resources" className="not-found-backlink">
            <ArrowLeft size={16} />
            Explore resources instead
          </Link>
        </div>

        <div className="not-found-stage" aria-hidden="true">
          <div className="not-found-orb not-found-orb-large" />
          <div className="not-found-orb not-found-orb-small" />
          <div className="not-found-card">
            <span>Page not found</span>
            <strong>Try a clearer route</strong>
            <p>Use the dashboard, reading plans, or the homepage to re-enter.</p>
          </div>
        </div>
      </section>

      <section className="not-found-grid">
        {destinations.map(({ href, title, copy, icon: Icon }) => (
          <article key={title} className="content-card not-found-card-link">
            <span className="content-badge">
              <Icon size={14} />
              Suggested path
            </span>
            <h2>{title}</h2>
            <p>{copy}</p>
            <Link href={href} className="button-secondary">
              Open
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
