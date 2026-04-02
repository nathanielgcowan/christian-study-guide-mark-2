import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";
import { getTopicHubs } from "@/lib/topic-hubs";
import { getTopicStudyPlans } from "@/lib/topic-study-plans";

export default function TopicsPage() {
  const topics = getTopicHubs();
  const topicPlans = getTopicStudyPlans();

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Topic studies</p>
        <h1>Study Scripture by the questions, struggles, and growth areas people actually bring.</h1>
        <p className="content-lead">
          These guided topic hubs gather key passages, reading paths, prayer
          direction, and next steps so readers can explore a biblical theme
          without piecing it together alone.
        </p>
        <div className="content-chip-row">
          <span className="content-chip">
            <Compass size={14} />
            {topics.length} guided hubs
          </span>
          <span className="content-chip">
            <Sparkles size={14} />
            Passages, prompts, and prayer focus
          </span>
        </div>
      </section>

      <section className="content-grid-two">
        {topics.map((topic) => (
          <article key={topic.slug} className="content-card">
            <div className="content-chip-row">
              <span className="content-badge">{topic.theme}</span>
              <span className="content-card-meta">{topic.keyVerses.length} key verses</span>
            </div>
            <h2 className="content-card-title">{topic.title}</h2>
            <p>{topic.summary}</p>
            <div className="content-card-note">
              <strong>Start with</strong>
              <p>{topic.keyVerses[0]}</p>
            </div>
            <div className="content-actions">
              <Link href={`/topics/${topic.slug}`} className="button-primary">
                Open topic hub
              </Link>
              <Link
                href={`/passage/${encodeURIComponent(topic.keyVerses[0])}`}
                className="button-secondary"
              >
                Read key passage
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Topic-based plans</p>
          <h2>Follow guided multi-day tracks for specific seasons and questions</h2>
        </div>
        <div className="content-grid-two">
          {topicPlans.map((plan) => (
            <article key={plan.slug} className="content-card">
              <div className="content-chip-row">
                <span className="content-badge">{plan.theme}</span>
                <span className="content-card-meta">{plan.durationLabel}</span>
              </div>
              <h3 className="content-card-title">{plan.title}</h3>
              <p>{plan.summary}</p>
              <div className="content-actions">
                <Link href={`/reading-plans/topics/${plan.slug}`} className="button-primary">
                  Open study plan
                </Link>
                <Link href="/reading-plans" className="button-secondary">
                  Track progress
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
