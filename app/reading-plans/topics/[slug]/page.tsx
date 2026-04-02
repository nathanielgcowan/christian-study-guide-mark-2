import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getTopicStudyPlanBySlug,
  getTopicStudyPlans,
} from "@/lib/topic-study-plans";

export function generateStaticParams() {
  return getTopicStudyPlans().map((plan) => ({
    slug: plan.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const plan = getTopicStudyPlanBySlug(slug);

  return {
    title: plan ? `${plan.title} | Topic Reading Plans` : "Topic Reading Plans",
    description: plan?.summary ?? "Guided topic-based study plan",
  };
}

export default async function TopicReadingPlanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plan = getTopicStudyPlanBySlug(slug);

  if (!plan) {
    notFound();
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Topic reading plan</p>
        <h1>{plan.title}</h1>
        <p className="content-lead">{plan.description}</p>
        <div className="content-chip-row">
          <span className="content-chip">{plan.durationLabel}</span>
          <span className="content-chip">{plan.theme}</span>
          <span className="content-chip">{plan.difficulty}</span>
        </div>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">What this plan does</p>
            <h2>Outcomes to pursue over the next several days</h2>
          </div>
          <div className="content-stack">
            {plan.outcomes.map((outcome) => (
              <article key={outcome} className="content-card-note">
                <p>{outcome}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Use with</p>
            <h2>Keep the track connected to the rest of your study flow</h2>
          </div>
          <div className="content-stack">
            {plan.relatedTopicSlug ? (
              <div className="content-card-note">
                <strong>Topic hub</strong>
                <p>Pair this daily track with the broader topic hub for extra verses and prompts.</p>
                <Link href={`/topics/${plan.relatedTopicSlug}`} className="button-secondary">
                  Open topic hub
                </Link>
              </div>
            ) : null}
            <div className="content-card-note">
              <strong>Reading plans</strong>
              <p>Return to the reading plan index to start or track progress on this plan.</p>
              <Link href="/reading-plans" className="button-secondary">
                Open reading plans
              </Link>
            </div>
            <div className="content-card-note">
              <strong>Prayer and notes</strong>
              <p>Use journal and prayer tools to capture what each day surfaces.</p>
              <div className="content-actions">
                <Link href="/journal" className="button-secondary">
                  Open journal
                </Link>
                <Link href="/user/prayer-requests" className="button-secondary">
                  Prayer requests
                </Link>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Daily guide</p>
          <h2>Follow the plan one day at a time</h2>
        </div>
        <div className="content-stack">
          {plan.daysList.map((day) => (
            <article key={`${plan.slug}-${day.day}`} className="content-card">
              <div className="content-chip-row">
                <span className="content-badge">Day {day.day}</span>
                <span className="content-card-meta">{day.reference}</span>
              </div>
              <h3 className="content-card-title">{day.title}</h3>
              <div className="content-grid-two">
                <div className="content-card-note">
                  <strong>Focus</strong>
                  <p>{day.focus}</p>
                </div>
                <div className="content-card-note">
                  <strong>Reflection</strong>
                  <p>{day.reflection}</p>
                </div>
              </div>
              <div className="content-card-note">
                <strong>Prayer</strong>
                <p>{day.prayer}</p>
              </div>
              <div className="content-actions">
                <Link
                  href={`/passage/${encodeURIComponent(day.reference)}`}
                  className="button-primary"
                >
                  Open day {day.day}
                </Link>
                <Link href="/reading-plans" className="button-secondary">
                  Track on reading plans page
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
