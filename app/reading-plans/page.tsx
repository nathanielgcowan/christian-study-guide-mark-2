"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const readingPlans = [
  {
    id: "new-testament-30-days",
    title: "New Testament in 30 Days",
    description:
      "Read through the New Testament in one month with focused daily passages.",
    duration: "30 days",
    days: 30,
    books: 27,
    difficulty: "Beginner",
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
  },
];

interface UserPlanProgress {
  plan_id: string;
  current_day: number;
  completed: boolean;
  completed_at: string | null;
}

export default function ReadingPlans() {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, UserPlanProgress>>(
    {},
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
        const nextMap = Object.fromEntries(
          data.plans.map((plan) => [plan.plan_id, plan]),
        );
        setProgressMap(nextMap);
      }
      setLoading(false);
    }

    void loadProgress();
  }, []);

  const completedCount = useMemo(
    () => Object.values(progressMap).filter((plan) => plan.completed).length,
    [progressMap],
  );

  async function startPlan(planId: string) {
    setSavingPlanId(planId);
    const plan = readingPlans.find((item) => item.id === planId);
    const response = await fetch("/api/user/reading-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, days: plan?.days }),
    });

    if (response.ok) {
      const data = (await response.json()) as { plan: UserPlanProgress };
      setProgressMap((current) => ({ ...current, [planId]: data.plan }));
    }
    setSavingPlanId(null);
  }

  async function updatePlan(planId: string, currentDay: number, completed = false) {
    setSavingPlanId(planId);
    const response = await fetch(`/api/user/reading-plans/${planId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentDay, completed }),
    });

    if (response.ok) {
      const data = (await response.json()) as { plan: UserPlanProgress };
      setProgressMap((current) => ({ ...current, [planId]: data.plan }));
    }
    setSavingPlanId(null);
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Structured Scripture habits</p>
        <h1>Reading plans with real progress tracking now built in.</h1>
        <p className="content-lead">
          Start a plan, move day by day, and keep completion history tied to
          your account instead of losing momentum between visits.
        </p>
        <div className="content-chip-row">
          <span className="content-chip">{completedCount} completed plans</span>
          <span className="content-chip">
            {Object.keys(progressMap).length} active enrollments
          </span>
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

      <section className="content-grid-three">
        {readingPlans.map((plan) => {
          const progress = progressMap[plan.id];
          const nextDay = Math.min((progress?.current_day ?? 0) + 1, plan.days);

          return (
            <article key={plan.id} className="content-card">
              <div className="content-chip-row">
                <span className="content-badge">{plan.difficulty}</span>
                <span className="content-card-meta">{plan.duration}</span>
              </div>
              <h2 className="content-card-title">{plan.title}</h2>
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
                    <span className="content-badge">Completed</span>
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
      </section>
    </main>
  );
}
