"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getTopicStudyPlans } from "@/lib/topic-study-plans";

const coreReadingPlans = [
  {
    id: "new-testament-30-days",
    title: "New Testament in 30 Days",
    description:
      "Read through the New Testament in one month with focused daily passages.",
    duration: "30 days",
    days: 30,
    books: 27,
    difficulty: "Beginner",
    href: "/reading-plans",
    category: "Core plan",
  },
  {
    id: "psalms-wisdom",
    title: "Psalms & Wisdom Literature",
    description:
      "Explore prayer, poetry, and wisdom through the reflective books of Scripture.",
    duration: "21 days",
    days: 21,
    books: 5,
    difficulty: "Intermediate",
    href: "/reading-plans",
    category: "Core plan",
  },
  {
    id: "gospel-jesus",
    title: "The Life of Jesus",
    description:
      "Walk through the four Gospels to stay close to the life and teaching of Christ.",
    duration: "14 days",
    days: 14,
    books: 4,
    difficulty: "Beginner",
    href: "/reading-plans",
    category: "Core plan",
  },
  {
    id: "old-testament-overview",
    title: "Old Testament Overview",
    description:
      "A wider journey through the Old Testament for readers who want big-picture context.",
    duration: "90 days",
    days: 90,
    books: 39,
    difficulty: "Advanced",
    href: "/reading-plans",
    category: "Core plan",
  },
  {
    id: "epistles-paul",
    title: "Paul's Letters",
    description:
      "Study the apostle Paul's letters with space for doctrine, encouragement, and application.",
    duration: "45 days",
    days: 45,
    books: 13,
    difficulty: "Intermediate",
    href: "/reading-plans",
    category: "Core plan",
  },
  {
    id: "daily-psalms",
    title: "Daily Psalms",
    description:
      "Read one Psalm each day for a month of worship, lament, and trust.",
    duration: "30 days",
    days: 30,
    books: 1,
    difficulty: "Beginner",
    href: "/reading-plans",
    category: "Core plan",
  },
];

interface UserPlanProgress {
  plan_id: string;
  current_day: number;
  completed: boolean;
  completed_at: string | null;
}

type ReadingPlanCard = {
  id: string;
  title: string;
  description: string;
  duration: string;
  days: number;
  books: number;
  difficulty: string;
  href: string;
  category: string;
  theme?: string;
};

export default function ReadingPlans() {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, UserPlanProgress>>(
    {},
  );

  const topicPlans = useMemo<ReadingPlanCard[]>(
    () =>
      getTopicStudyPlans().map((plan) => ({
        id: plan.slug,
        title: plan.title,
        description: plan.summary,
        duration: plan.durationLabel,
        days: plan.days,
        books: new Set(plan.daysList.map((day) => day.reference.split(" ")[0])).size,
        difficulty: plan.difficulty,
        href: `/reading-plans/topics/${plan.slug}`,
        category: "Topic track",
        theme: plan.theme,
      })),
    [],
  );

  const readingPlans = useMemo<ReadingPlanCard[]>(
    () => [...topicPlans, ...coreReadingPlans],
    [topicPlans],
  );

  useEffect(() => {
    async function loadProgress() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setSignedIn(false);
        setLoading(false);
        return;
      }

      setSignedIn(true);
      const response = await fetch("/api/user/reading-plans");
      if (response.ok) {
        const data = (await response.json()) as { plans: UserPlanProgress[] };
        const nextMap = Object.fromEntries(data.plans.map((plan) => [plan.plan_id, plan]));
        setProgressMap(nextMap);
      } else {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setStatusMessage(
          data?.error?.includes("user_reading_plans")
            ? "Reading plan tracking is not set up in Supabase yet."
            : data?.error ?? "Unable to load your reading plan progress right now.",
        );
      }
      setLoading(false);
    }

    void loadProgress();
  }, []);

  const completedCount = useMemo(
    () => Object.values(progressMap).filter((plan) => plan.completed).length,
    [progressMap],
  );

  function buildShareMessage(plan: ReadingPlanCard, progress: UserPlanProgress) {
    const progressPercent = Math.max(
      0,
      Math.min(100, Math.round((progress.current_day / plan.days) * 100)),
    );

    if (progress.completed) {
      return `I just completed the "${plan.title}" reading plan on Christian Study Guide. ${plan.days} days of Scripture, reflection, and steady progress.`;
    }

    return `I just reached day ${progress.current_day} of ${plan.days} in the "${plan.title}" reading plan on Christian Study Guide. ${progressPercent}% complete and still going.`;
  }

  async function sharePlanProgress(plan: ReadingPlanCard, progress: UserPlanProgress) {
    const shareText = buildShareMessage(plan, progress);
    const shareUrl =
      typeof window === "undefined"
        ? plan.href
        : `${window.location.origin}${plan.href}`;

    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.share
      ) {
        await navigator.share({
          title: `${plan.title} progress`,
          text: shareText,
          url: shareUrl,
        });
        setStatusMessage("Reading plan progress shared.");
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setStatusMessage("Reading plan progress copied to clipboard.");
        return;
      }

      setStatusMessage("Sharing is not supported in this browser.");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      setStatusMessage("Unable to share this reading plan right now.");
    }
  }

  async function startPlan(planId: string) {
    setSavingPlanId(planId);
    setStatusMessage(null);
    const plan = readingPlans.find((item) => item.id === planId);
    const response = await fetch("/api/user/reading-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, days: plan?.days }),
    });

    if (response.ok) {
      const data = (await response.json()) as { plan: UserPlanProgress };
      setProgressMap((current) => ({ ...current, [planId]: data.plan }));
      setStatusMessage(`Started "${plan?.title ?? "reading plan"}".`);
    } else {
      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setStatusMessage(
        data?.error?.includes("user_reading_plans")
          ? "Reading plan tracking is not set up in Supabase yet. Run the reading-plan table migration first."
          : data?.error ?? "Unable to start this plan right now.",
      );
    }
    setSavingPlanId(null);
  }

  async function updatePlan(planId: string, currentDay: number, completed = false) {
    setSavingPlanId(planId);
    setStatusMessage(null);
    const response = await fetch(`/api/user/reading-plans/${planId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentDay, completed }),
    });

    if (response.ok) {
      const data = (await response.json()) as { plan: UserPlanProgress };
      setProgressMap((current) => ({ ...current, [planId]: data.plan }));
      setStatusMessage(
        completed ? "Reading plan completed." : `Updated to day ${currentDay}.`,
      );
    } else {
      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setStatusMessage(
        data?.error?.includes("user_reading_plans")
          ? "Reading plan tracking is not set up in Supabase yet. Run the reading-plan table migration first."
          : data?.error ?? "Unable to update this plan right now.",
      );
    }
    setSavingPlanId(null);
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Structured Scripture habits</p>
        <h1>Core reading plans plus guided topic tracks for real-life seasons.</h1>
        <p className="content-lead">
          Start a plan, move day by day, and now choose topic-based tracks for
          anxiety, prayer, grief, marriage, and spiritual formation with a
          guided reading focus each day.
        </p>
        <div className="content-chip-row">
          <span className="content-chip">{completedCount} completed plans</span>
          <span className="content-chip">
            {Object.keys(progressMap).length} active enrollments
          </span>
          <span className="content-chip">{topicPlans.length} topic tracks</span>
        </div>
      </section>

      {!signedIn && !loading ? (
        <section className="content-card">
          <h2>Sign in to save reading plan progress.</h2>
          <div className="content-actions">
            <Link href="/auth/signin" className="button-primary">
              Sign in
            </Link>
          </div>
        </section>
      ) : null}

      {statusMessage ? (
        <section className="content-card">
          <p className="share-status">{statusMessage}</p>
        </section>
      ) : null}

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Topic tracks</p>
          <h2>Guided multi-day plans for specific seasons and needs</h2>
        </div>
        <div className="content-grid-two">
          {topicPlans.map((plan) => {
            const progress = progressMap[plan.id];
            const nextDay = Math.min((progress?.current_day ?? 0) + 1, plan.days);

            return (
              <article key={plan.id} className="content-card">
                <div className="content-chip-row">
                  <span className="content-badge">{plan.category}</span>
                  <span className="content-card-meta">{plan.duration}</span>
                  {plan.theme ? <span className="content-chip">{plan.theme}</span> : null}
                </div>
                <h3 className="content-card-title">{plan.title}</h3>
                <p>{plan.description}</p>
                <div className="content-chip-row">
                  <span className="content-chip">{plan.days} days</span>
                  <span className="content-chip">{plan.books} books</span>
                  {progress ? (
                    <span className="content-chip">
                      Day {progress.current_day || 1} of {plan.days}
                    </span>
                  ) : null}
                </div>
                <div className="content-actions">
                  <Link href={plan.href} className="button-secondary">
                    View plan
                  </Link>
                  {signedIn ? (
                    !progress ? (
                      <button
                        onClick={() => void startPlan(plan.id)}
                        className="button-primary"
                        disabled={savingPlanId === plan.id}
                      >
                        Start plan
                      </button>
                    ) : progress.completed ? (
                      <>
                        <span className="content-badge">Completed</span>
                        <button
                          onClick={() => void sharePlanProgress(plan, progress)}
                          className="button-secondary"
                          disabled={savingPlanId === plan.id}
                        >
                          Share completion
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => void updatePlan(plan.id, nextDay)}
                          className="button-primary"
                          disabled={savingPlanId === plan.id}
                        >
                          Mark next day
                        </button>
                        <button
                          onClick={() => void sharePlanProgress(plan, progress)}
                          className="button-secondary"
                          disabled={savingPlanId === plan.id}
                        >
                          Share milestone
                        </button>
                      </>
                    )
                  ) : (
                    <Link href="/auth/signin" className="button-primary">
                      Sign in to track
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Core plans</p>
          <h2>Longer reading rhythms for bigger Bible journeys</h2>
        </div>
        <div className="content-grid-three">
          {coreReadingPlans.map((plan) => {
            const progress = progressMap[plan.id];
            const nextDay = Math.min((progress?.current_day ?? 0) + 1, plan.days);

            return (
              <article key={plan.id} className="content-card">
                <div className="content-chip-row">
                  <span className="content-badge">{plan.difficulty}</span>
                  <span className="content-card-meta">{plan.duration}</span>
                </div>
                <h3 className="content-card-title">{plan.title}</h3>
                <p>{plan.description}</p>
                <div className="content-chip-row">
                  <span className="content-chip">{plan.books} books</span>
                  {progress ? (
                    <span className="content-chip">
                      Day {progress.current_day || 1} of {plan.days}
                    </span>
                  ) : null}
                </div>

                {signedIn ? (
                  <div className="content-actions">
                    {!progress ? (
                      <button
                        onClick={() => void startPlan(plan.id)}
                        className="button-primary"
                        disabled={savingPlanId === plan.id}
                      >
                        Start plan
                      </button>
                    ) : progress.completed ? (
                      <>
                        <span className="content-badge">Completed</span>
                        <button
                          onClick={() => void sharePlanProgress(plan, progress)}
                          className="button-secondary"
                          disabled={savingPlanId === plan.id}
                        >
                          Share completion
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => void updatePlan(plan.id, nextDay)}
                          className="button-primary"
                          disabled={savingPlanId === plan.id}
                        >
                          Mark next day
                        </button>
                        <button
                          onClick={() => void updatePlan(plan.id, plan.days, true)}
                          className="button-secondary"
                          disabled={savingPlanId === plan.id}
                        >
                          Finish plan
                        </button>
                        <button
                          onClick={() => void sharePlanProgress(plan, progress)}
                          className="button-secondary"
                          disabled={savingPlanId === plan.id}
                        >
                          Share milestone
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <Link href="/auth/signin" className="button-secondary">
                    Sign in to track
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
