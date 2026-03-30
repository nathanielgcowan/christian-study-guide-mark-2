import Link from "next/link";
import { Compass, ExternalLink, MapPinned } from "lucide-react";
import { siteRouteSections } from "@/lib/site-routes";

export default function SiteMapPage() {
  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Site map</p>
        <h1>Every major route in one easier-to-browse directory.</h1>
        <p className="content-lead">
          Use this page like a human-friendly route index. It is a faster way to
          discover what exists than guessing URLs or reading the XML sitemap.
        </p>
        <div className="content-chip-row">
          <span className="content-chip">
            <MapPinned size={14} />
            {siteRouteSections.reduce((count, section) => count + section.routes.length, 0)} routes
          </span>
          <span className="content-chip">
            <Compass size={14} />
            Grouped by purpose
          </span>
        </div>
      </section>

      {siteRouteSections.map((section) => (
        <section key={section.title} className="content-section-card content-stack">
          <div className="content-section-heading">
            <p className="eyebrow">Directory</p>
            <h2>{section.title}</h2>
          </div>
          <div className="site-map-grid">
            {section.routes.map((route) => (
              <article key={route.href} className="content-card site-map-card">
                <div className="content-card-note">
                  <strong>{route.label}</strong>
                  <p>{route.description}</p>
                </div>
                <code>{route.href}</code>
                <Link href={route.href} className="button-secondary">
                  <ExternalLink size={16} />
                  Open route
                </Link>
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
