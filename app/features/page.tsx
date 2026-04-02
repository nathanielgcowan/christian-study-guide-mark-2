import Link from "next/link";
import type { Metadata } from "next";
import { Layers3, Sparkles } from "lucide-react";
import { siteFeatureGroups } from "@/lib/site-features";

export const metadata: Metadata = {
  title: "Features",
  description:
    "A dedicated overview of the major features available across Christian Study Guide.",
};

export default function FeaturesPage() {
  const featureCount = siteFeatureGroups.reduce(
    (count, group) => count + group.features.length,
    0,
  );

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Feature overview</p>
        <h1>Every major feature of the website in one clearer product page.</h1>
        <p className="content-lead">
          Use this page like a feature catalog. It is meant to show what the
          platform can do across Bible reading, study, prayer, memory, groups,
          context tools, and account features.
        </p>
        <div className="content-chip-row">
          <span className="content-chip">
            <Layers3 size={14} />
            {featureCount} features highlighted
          </span>
          <span className="content-chip">
            <Sparkles size={14} />
            Grouped by purpose
          </span>
        </div>
      </section>

      {siteFeatureGroups.map((group) => (
        <section key={group.title} className="content-section-card content-stack">
          <div className="content-section-heading">
            <p className="eyebrow">{group.eyebrow}</p>
            <h2>{group.title}</h2>
            <p>{group.description}</p>
          </div>
          <div className="content-grid-two">
            {group.features.map((feature) => (
              <article key={feature.name} className="content-card">
                <div className="content-card-note">
                  <strong>{feature.name}</strong>
                  <p>{feature.description}</p>
                </div>
                <code>{feature.href}</code>
                <Link href={feature.href} className="button-secondary">
                  Open feature
                </Link>
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
