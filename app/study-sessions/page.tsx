"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { parseBibleReference } from "@/lib/bible";

interface StudyItem {
  id: string;
  reference: string;
  translation: string;
  read_at: string;
  time_spent_minutes: number;
  completed: boolean;
}

interface StudyStreak {
  current_streak: number;
  best_streak: number;
  total_studies: number;
}

function formatWeekLabel(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Unknown week";
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  return start.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function getTimeOfDayBucket(dateString: string) {
  const hour = new Date(dateString).getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  if (hour < 21) return "Evening";
  return "Late night";
}

export default function StudySessionsPage() {
  const [sessions, setSessions] = useState<StudyItem[]>([]);
  const [streak, setStreak] = useState<StudyStreak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/user/studies?limit=120");
      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = (await response.json()) as {
        streak: StudyStreak | null;
        recentStudies: StudyItem[];
      };
      setStreak(data.streak);
      setSessions(data.recentStudies ?? []);
      setLoading(false);
    }

    void load();
  }, []);

  const analytics = useMemo(() => {
    const totalMinutes = sessions.reduce(
      (sum, session) => sum + (session.time_spent_minutes || 0),
      0,
    );

    const completedSessions = sessions.filter((session) => session.completed);
    const averageSessionLength =
      sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0;

    const weeklyCompletionMap = new Map<string, number>();
    const bookCounts = new Map<string, number>();
    const timeOfDayCounts = new Map<string, number>();

    completedSessions.forEach((session) => {
      const weekLabel = formatWeekLabel(session.read_at);
      weeklyCompletionMap.set(weekLabel, (weeklyCompletionMap.get(weekLabel) ?? 0) + 1);

      const parsed = parseBibleReference(session.reference);
      const book = parsed?.book ?? session.reference.split(" ")[0] ?? session.reference;
      bookCounts.set(book, (bookCounts.get(book) ?? 0) + 1);

      const bucket = getTimeOfDayBucket(session.read_at);
      timeOfDayCounts.set(bucket, (timeOfDayCounts.get(bucket) ?? 0) + 1);
    });

    const chapterCompletionTrend = Array.from(weeklyCompletionMap.entries())
      .slice(0, 6)
      .map(([label, count]) => ({ label, count }))
      .reverse();

    const favoriteBooks = Array.from(bookCounts.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 4)
      .map(([book, count]) => ({ book, count }));

    const timeOfDayHabits = ["Morning", "Afternoon", "Evening", "Late night"].map(
      (label) => ({
        label,
        count: timeOfDayCounts.get(label) ?? 0,
      }),
    );

    const strongestHabit =
      [...timeOfDayHabits].sort((left, right) => right.count - left.count)[0] ?? null;

    return {
      totalMinutes,
      averageSessionLength,
      chapterCompletionTrend,
      favoriteBooks,
      timeOfDayHabits,
      strongestHabit,
      completedSessions: completedSessions.length,
    };
  }, [sessions]);

  if (loading) {
    return (
      <main className="page-shell content-shell-narrow">
        <section className="content-card">
          <h2>Loading study sessions...</h2>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Study sessions</p>
        <h1>Review what you have actually read, studied, and completed.</h1>
        <p className="content-lead">
          This page now turns your session history into reading analytics, so you can
          see completion trends, favorite books, session length, and the time windows
          when you tend to show up most consistently.
        </p>
      </section>

      <section className="content-grid-three">
        <article className="content-stat">
          <span>Current streak</span>
          <strong>{streak?.current_streak ?? 0}</strong>
        </article>
        <article className="content-stat">
          <span>Average session</span>
          <strong>{analytics.averageSessionLength} min</strong>
        </article>
        <article className="content-stat">
          <span>Total logged minutes</span>
          <strong>{analytics.totalMinutes}</strong>
        </article>
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Reading analytics</p>
          <h2>What your habits are showing</h2>
        </div>
        <div className="content-grid-two">
          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Chapter completion trend</p>
              <h2>Recent weekly momentum</h2>
            </div>
            {analytics.chapterCompletionTrend.length > 0 ? (
              <div className="content-stack">
                {analytics.chapterCompletionTrend.map((entry) => (
                  <div key={entry.label} className="content-card-note">
                    <strong>{entry.label}</strong>
                    <p>
                      {entry.count} completed session{entry.count === 1 ? "" : "s"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="content-card-note">
                Complete a few reading sessions and your weekly chapter trend will show up here.
              </div>
            )}
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Favorite books</p>
              <h2>Where you return most often</h2>
            </div>
            {analytics.favoriteBooks.length > 0 ? (
              <div className="content-stack">
                {analytics.favoriteBooks.map((entry) => (
                  <div key={entry.book} className="content-card-note">
                    <strong>{entry.book}</strong>
                    <p>
                      {entry.count} completed session{entry.count === 1 ? "" : "s"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="content-card-note">
                Favorite books will appear once you build a little more reading history.
              </div>
            )}
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Session length</p>
              <h2>How long you usually stay with the text</h2>
            </div>
            <div className="content-card-note">
              <strong>{analytics.averageSessionLength} minutes on average</strong>
              <p>
                Across {sessions.length} logged session{sessions.length === 1 ? "" : "s"}, your
                current pace suggests a steady reading window instead of one-off marathons.
              </p>
            </div>
            <div className="content-card-note">
              <strong>{analytics.completedSessions} completed sessions</strong>
              <p>
                Total studies logged: {streak?.total_studies ?? 0}. The more consistently you log,
                the clearer the analytics become.
              </p>
            </div>
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Time-of-day habits</p>
              <h2>When you naturally show up</h2>
            </div>
            {analytics.timeOfDayHabits.some((entry) => entry.count > 0) ? (
              <div className="content-stack">
                <div className="content-card-note">
                  <strong>
                    Strongest habit: {analytics.strongestHabit?.label ?? "Not enough data yet"}
                  </strong>
                  <p>
                    {analytics.strongestHabit?.count ?? 0} session
                    {(analytics.strongestHabit?.count ?? 0) === 1 ? "" : "s"} logged in that window.
                  </p>
                </div>
                {analytics.timeOfDayHabits.map((entry) => (
                  <div key={entry.label} className="content-card-note">
                    <strong>{entry.label}</strong>
                    <p>
                      {entry.count} session{entry.count === 1 ? "" : "s"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="content-card-note">
                Time-of-day habits will appear once your session history includes a few completed reads.
              </div>
            )}
          </section>
        </div>
      </section>

      <section className="content-stack">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <article key={session.id} className="content-card">
              <div className="content-chip-row">
                <span className="content-badge">{session.translation.toUpperCase()}</span>
                <span className="content-card-meta">
                  {new Date(session.read_at).toLocaleDateString()}
                </span>
              </div>
              <h2 className="content-card-title">{session.reference}</h2>
              <div className="content-card-note">
                <strong>{session.completed ? "Completed" : "In progress"}</strong>
                <p>
                  {session.time_spent_minutes > 0
                    ? `${session.time_spent_minutes} minutes logged`
                    : "Study session logged without minutes"}
                </p>
              </div>
              <div className="content-actions">
                <Link
                  href={`/passage/${encodeURIComponent(session.reference)}`}
                  className="button-primary"
                >
                  Reopen study
                </Link>
                <Link href="/dashboard" className="button-secondary">
                  Back to dashboard
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="content-card-note">
            No study sessions are logged yet. Open the Bible reader or passage
            workspace and begin studying to build your session history.
          </div>
        )}
      </section>
    </main>
  );
}
