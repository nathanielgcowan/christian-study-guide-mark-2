import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTopicHubBySlug, getTopicHubs } from "@/lib/topic-hubs";
import { getTopicStudyPlanByTopicSlug } from "@/lib/topic-study-plans";

export function generateStaticParams() {
  return getTopicHubs().map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicHubBySlug(slug);

  return {
    title: topic ? `${topic.title} | Topic Studies` : "Topic Studies",
    description: topic?.summary ?? "Guided biblical topic study",
  };
}

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicHubBySlug(slug);
  const relatedPlan = topic ? getTopicStudyPlanByTopicSlug(topic.slug) : null;

  if (!topic) {
    notFound();
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Topic study</p>
        <h1>{topic.title}</h1>
        <p className="content-lead">{topic.lead}</p>
        <div className="content-chip-row">
          <span className="content-chip">{topic.theme}</span>
          <span className="content-chip">{topic.keyVerses.length} key verses</span>
          <span className="content-chip">{topic.readingPath.length} reading steps</span>
        </div>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Key verses</p>
            <h2>Passages to keep in front of you</h2>
          </div>
          <div className="content-stack">
            {topic.keyVerses.map((reference) => (
              <Link
                key={`${topic.slug}-${reference}`}
                href={`/passage/${encodeURIComponent(reference)}`}
                className="content-card-note"
              >
                <strong>{reference}</strong>
                <p>Open this passage in the deeper study workspace.</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Reading path</p>
            <h2>Move through the theme in sequence</h2>
          </div>
          <div className="content-stack">
            {topic.readingPath.map((reference, index) => (
              <div key={`${topic.slug}-${reference}`} className="content-card-note">
                <strong>
                  Step {index + 1}: {reference}
                </strong>
                <p>Read this chapter and note what it adds to the theme.</p>
                <Link
                  href={`/passage/${encodeURIComponent(reference)}`}
                  className="button-secondary"
                >
                  Open reading step
                </Link>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Reflection</p>
            <h2>Questions that keep you inside the text</h2>
          </div>
          <div className="content-stack">
            {topic.reflectionPrompts.map((prompt) => (
              <article key={prompt} className="content-card-note">
                <p>{prompt}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Prayer focus</p>
            <h2>Ways to respond before God</h2>
          </div>
          <div className="content-stack">
            {topic.prayerFocus.map((item) => (
              <article key={item} className="content-card-note">
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Related tools</p>
          <h2>Carry this topic into the rest of your study flow</h2>
        </div>
        <div className="content-grid-three">
          {relatedPlan ? (
            <article className="content-card">
              <h3 className="content-card-title">Guided study plan</h3>
              <p>{relatedPlan.summary}</p>
              <Link href={`/reading-plans/topics/${relatedPlan.slug}`} className="button-secondary">
                Open {relatedPlan.durationLabel} plan
              </Link>
            </article>
          ) : null}
          {topic.relatedTools.map((tool) => (
            <article key={tool.href} className="content-card">
              <h3 className="content-card-title">{tool.label}</h3>
              <p>{tool.description}</p>
              <Link href={tool.href} className="button-secondary">
                Open
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
