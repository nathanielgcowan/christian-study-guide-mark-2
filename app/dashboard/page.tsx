"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BellRing,
  BookOpenText,
  BookMarked,
  Clock3,
  Flame,
  HeartHandshake,
  NotebookPen,
  Sparkles,
  UsersRound,
  WandSparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Preferences {
  focusGoal: string;
  preferredTranslation: string;
  dailyTargetMinutes: number;
  visibleWidgets: {
    bookmarks: boolean;
    prayerRequests: boolean;
    emailPreferences: boolean;
    studySummary: boolean;
  };
}

interface BookmarkItem {
  id: string;
  type: string;
  reference: string;
  title: string | null;
  createdAt: string;
}

interface PrayerRequestItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  updatedAt: string;
  isPublic?: boolean;
}

interface StudyStreak {
  streak: {
    current_streak: number;
    best_streak: number;
    total_studies: number;
  } | null;
  recentStudies: Array<{
    id: string;
    reference: string;
    translation: string;
    read_at: string;
    time_spent_minutes: number;
    completed: boolean;
  }>;
}

interface ReadingProgress {
  book: string;
  chapter: number;
  reference: string;
  translation: string;
  updatedAt: string | null;
  progress: {
    completedChapters: number;
    totalChapters: number;
    percentComplete: number;
  };
}

interface EmailPrefs {
  dailyDevotional: boolean;
  prayerUpdates: boolean;
  newsletter: boolean;
}

interface DashboardRecommendation {
  title: string;
  body: string;
  href: string;
  cta: string;
}

function getDisplayName(session: {
  user: {
    email?: string | null;
    user_metadata?: {
      full_name?: string | null;
      name?: string | null;
    };
  };
}) {
  const metadataName =
    session.user.user_metadata?.full_name || session.user.user_metadata?.name;

  if (metadataName?.trim()) {
    return metadataName.trim();
  }

  const email = session.user.email?.trim();
  if (email) {
    return email.split("@")[0];
  }

  return "Friend";
}

const defaultPreferences: Preferences = {
  focusGoal: "consistency",
  preferredTranslation: "web",
  dailyTargetMinutes: 20,
  visibleWidgets: {
    bookmarks: true,
    prayerRequests: true,
    emailPreferences: true,
    studySummary: true,
  },
};

const goalCopy = {
  consistency: {
    title: "Build a steady rhythm",
    lead: "Small faithful steps add up when the next action is obvious.",
  },
  depth: {
    title: "Go deeper today",
    lead: "Use the dashboard to move from reading into richer reflection and study.",
  },
  prayer: {
    title: "Keep prayer close",
    lead: "Let Scripture, requests, and follow-up stay in one calmer flow.",
  },
  memory: {
    title: "Hold onto what you read",
    lead: "A good dashboard keeps key passages within reach for review and repetition.",
  },
} as const;

function formatDateLabel(value: string | null | undefined) {
  if (!value) return "recently";
  return new Date(value).toLocaleDateString();
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [name, setName] = useState("Friend");
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequestItem[]>([]);
  const [studySummaryData, setStudySummaryData] = useState<StudyStreak["streak"]>(
    null,
  );
  const [recentStudies, setRecentStudies] = useState<StudyStreak["recentStudies"]>([]);
  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(null);
  const [emailPrefs, setEmailPrefs] = useState<EmailPrefs>({
    dailyDevotional: false,
    prayerUpdates: false,
    newsletter: false,
  });

  useEffect(() => {
    async function loadDashboard() {
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
      setName(getDisplayName(session));

      const [
        profileResponse,
        prefsResponse,
        bookmarksResponse,
        prayersResponse,
        studiesResponse,
        readingProgressResponse,
        emailPrefsResponse,
      ] =
        await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/user/preferences"),
          fetch("/api/user/bookmarks"),
          fetch("/api/user/prayer-requests?scope=mine"),
          fetch("/api/user/studies"),
          fetch("/api/user/reading-progress"),
          fetch("/api/user/email-prefs"),
        ]);

      if (profileResponse.ok) {
        const profile = (await profileResponse.json()) as { name?: string | null };
        if (profile.name?.trim()) {
          setName(profile.name.trim());
        }
      }

      if (prefsResponse.ok) {
        const data = (await prefsResponse.json()) as { preferences: Preferences };
        setPreferences(data.preferences);
      }

      if (bookmarksResponse.ok) {
        const data = (await bookmarksResponse.json()) as {
          bookmarks: BookmarkItem[];
        };
        setBookmarks(data.bookmarks);
      }

      if (prayersResponse.ok) {
        const data = (await prayersResponse.json()) as {
          prayerRequests: PrayerRequestItem[];
        };
        setPrayerRequests(data.prayerRequests);
      }

      if (studiesResponse.ok) {
        const data = (await studiesResponse.json()) as StudyStreak;
        setStudySummaryData(data.streak);
        setRecentStudies(data.recentStudies ?? []);
      }

      if (readingProgressResponse.ok) {
        const data = (await readingProgressResponse.json()) as {
          readingProgress: ReadingProgress;
        };
        setReadingProgress(data.readingProgress);
      }

      if (emailPrefsResponse.ok) {
        const data = (await emailPrefsResponse.json()) as { emailPrefs: EmailPrefs };
        setEmailPrefs(data.emailPrefs);
      }

      setLoading(false);
    }

    void loadDashboard();
  }, []);

  const studySummary = useMemo(() => {
    const activePrayers = prayerRequests.filter(
      (request) => request.status !== "answered",
    ).length;
    const studiedMinutes = recentStudies.reduce(
      (total, study) => total + (study.time_spent_minutes || 0),
      0,
    );

    return [
      {
        label: "Saved passages",
        value: bookmarks.length,
        icon: BookMarked,
      },
      {
        label: "Prayer requests",
        value: prayerRequests.length,
        icon: HeartHandshake,
      },
      {
        label: "Daily target",
        value: `${preferences.dailyTargetMinutes}m`,
        icon: Clock3,
      },
      {
        label: "Current streak",
        value: studySummaryData?.current_streak ?? 0,
        icon: Flame,
      },
      {
        label: "Open requests",
        value: activePrayers,
        icon: Sparkles,
      },
      {
        label: "Recent minutes",
        value: studiedMinutes,
        icon: NotebookPen,
      },
    ];
  }, [
    bookmarks.length,
    prayerRequests,
    recentStudies,
    preferences.dailyTargetMinutes,
    studySummaryData?.current_streak,
  ]);

  const todayFocus = useMemo(() => {
    const openPrayerCount = prayerRequests.filter(
      (request) => request.status !== "answered",
    ).length;

    const focusByGoal: Record<Preferences["focusGoal"], string> = {
      consistency: readingProgress
        ? `Resume ${readingProgress.reference} and protect your ${preferences.dailyTargetMinutes}-minute habit.`
        : `Start a short reading session and aim for ${preferences.dailyTargetMinutes} focused minutes.`,
      depth: readingProgress
        ? `Return to ${readingProgress.reference}, then move into comparison, notes, or passage study.`
        : "Open a passage study and spend time connecting context, cross references, and application.",
      prayer:
        openPrayerCount > 0
          ? `You have ${openPrayerCount} open prayer request${openPrayerCount === 1 ? "" : "s"} waiting for follow-up today.`
          : "Write one prayer after your reading so the habit stays personal, not only informational.",
      memory:
        bookmarks.length > 0
          ? `Revisit one saved passage and choose a verse worth carrying into the rest of the day.`
          : "Bookmark one verse from today’s reading so memory work has a clear starting place.",
    };

    return focusByGoal[preferences.focusGoal as keyof typeof focusByGoal] ??
      focusByGoal.consistency;
  }, [bookmarks.length, preferences.dailyTargetMinutes, preferences.focusGoal, prayerRequests, readingProgress]);

  const nextSteps = useMemo(() => {
    const steps = [];

    if (readingProgress) {
      steps.push({
        title: "Resume your reading place",
        body: `${readingProgress.reference} is your last saved chapter in ${readingProgress.translation.toUpperCase()}.`,
        href: `/bible/${encodeURIComponent(readingProgress.book)}/${readingProgress.chapter}`,
        cta: "Continue reading",
      });
    } else {
      steps.push({
        title: "Start your next reading session",
        body: "Open the Bible reader and your dashboard will begin tracking where you left off.",
        href: "/bible",
        cta: "Open Bible reader",
      });
    }

    if (preferences.focusGoal === "prayer") {
      steps.push({
        title: "Keep prayer near your study",
        body: prayerRequests.length
          ? "Review your active requests and mark one for follow-up after reading."
          : "Add one personal request so prayer remains part of your daily rhythm.",
        href: "/user/prayer-requests",
        cta: prayerRequests.length ? "Review requests" : "Add a request",
      });
    } else if (preferences.focusGoal === "memory") {
      steps.push({
        title: "Choose a verse to keep",
        body: bookmarks.length
          ? "Turn one saved passage into a memorization or reflection touchpoint."
          : "Save one meaningful passage today so repetition has a clear anchor.",
        href: bookmarks.length ? "/user/bookmarks" : "/verse-comparison",
        cta: bookmarks.length ? "Open bookmarks" : "Compare and save",
      });
    } else if (preferences.focusGoal === "depth") {
      steps.push({
        title: "Move from reading into study",
        body: "Use the deeper passage workspace when a chapter deserves more than a quick skim.",
        href: "/passage/John%203%3A16",
        cta: "Open passage study",
      });
    } else {
      steps.push({
        title: "Choose a plan that fits your pace",
        body: `Your target is ${preferences.dailyTargetMinutes} minutes, which pairs well with a structured reading path.`,
        href: "/reading-plans",
        cta: "Browse plans",
      });
    }

    steps.push({
      title: "Tune your dashboard",
      body: "Adjust your focus goal, preferred translation, and visible widgets whenever your rhythm changes.",
      href: "/user/settings",
      cta: "Update settings",
    });

    return steps;
  }, [bookmarks.length, preferences.dailyTargetMinutes, preferences.focusGoal, prayerRequests.length, readingProgress]);

  const recommendations = useMemo<DashboardRecommendation[]>(() => {
    const items: DashboardRecommendation[] = [];

    if ((studySummaryData?.current_streak ?? 0) < 3) {
      items.push({
        title: "Make today easy to repeat",
        body: "Short, repeatable sessions tend to rebuild momentum faster than ambitious one-off study bursts.",
        href: "/reading-plans",
        cta: "Open reading plans",
      });
    }

    if (bookmarks.length === 0) {
      items.push({
        title: "Save what you want to revisit",
        body: "A personalized dashboard gets stronger when key verses and passages have somewhere to live.",
        href: "/verse-comparison",
        cta: "Save a passage",
      });
    }

    if (preferences.focusGoal === "depth") {
      items.push({
        title: "Use the richer study workflow",
        body: "Comparison, notes, and passage context are the fastest way to turn reading into deeper understanding.",
        href: "/passage/John%203%3A16",
        cta: "Open passage study",
      });
    }

    if (preferences.focusGoal === "prayer" || prayerRequests.length === 0) {
      items.push({
        title: "Keep your prayer rhythm visible",
        body: "A personal dashboard works best when requests stay close to reading and follow-up, not hidden in another page.",
        href: "/user/prayer-requests",
        cta: "Open prayer requests",
      });
    }

    if (!emailPrefs.dailyDevotional || !emailPrefs.prayerUpdates) {
      items.push({
        title: "Turn on only the reminders that help",
        body: "Devotional and prayer updates can support consistency without turning your inbox into noise.",
        href: "/user/settings",
        cta: "Manage reminders",
      });
    }

    if (items.length < 3) {
      items.push({
        title: "Create shareable Scripture",
        body: "A verse image can turn a meaningful passage into something you revisit, keep, or share with others.",
        href: "/user/verse-generator",
        cta: "Open verse studio",
      });
    }

    return items.slice(0, 3);
  }, [bookmarks.length, emailPrefs.dailyDevotional, emailPrefs.prayerUpdates, prayerRequests.length, preferences.focusGoal, studySummaryData?.current_streak]);

  if (loading) {
    return (
      <main className="minimal-shell">
        <section className="minimal-card minimal-status">
          <h2>Loading dashboard...</h2>
        </section>
      </main>
    );
  }

  if (!signedIn) {
    return (
      <main className="minimal-shell">
        <section className="minimal-card minimal-status">
          <h2>Please sign in to view your dashboard.</h2>
          <div className="minimal-actions">
            <Link href="/auth/signin" className="button-primary">
              Sign in
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const goalPanel = goalCopy[
    (preferences.focusGoal as keyof typeof goalCopy) ?? "consistency"
  ] ?? goalCopy.consistency;

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Personal dashboard</p>
        <h1>{name}, here is your study rhythm for today.</h1>
        <p className="content-lead">
          {goalPanel.lead}
        </p>
        <div className="content-chip-row">
          <span className="content-chip">{goalPanel.title}</span>
          <span className="content-chip">Goal: {preferences.focusGoal}</span>
          <span className="content-chip">
            Translation: {preferences.preferredTranslation.toUpperCase()}
          </span>
          <span className="content-chip">
            Target: {preferences.dailyTargetMinutes} minutes
          </span>
        </div>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Today</p>
            <h2>Your next faithful step</h2>
          </div>
          <div className="content-card-note">
            <strong>{todayFocus}</strong>
            <p>
              The dashboard is now prioritizing your {preferences.focusGoal} goal
              instead of showing the same generic entry points every time.
            </p>
          </div>
          <div className="content-stack">
            {nextSteps.map((step) => (
              <div key={step.title} className="content-card-note">
                <strong>{step.title}</strong>
                <p>{step.body}</p>
                <Link href={step.href} className="button-secondary">
                  {step.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Momentum</p>
            <h2>What your recent rhythm shows</h2>
          </div>
          <div className="content-card-note">
            <strong>
              {studySummaryData?.current_streak ?? 0}-day streak with{" "}
              {studySummaryData?.total_studies ?? 0} total study session
              {studySummaryData?.total_studies === 1 ? "" : "s"}.
            </strong>
            <p>
              Best streak: {studySummaryData?.best_streak ?? 0}. Recent study
              activity and prayer follow-up help shape what appears next here.
            </p>
          </div>
          {recentStudies.length > 0 ? (
            <div className="content-stack">
              {recentStudies.slice(0, 3).map((study) => (
                <div key={study.id} className="content-card-note">
                  <strong>{study.reference}</strong>
                  <p>
                    {study.translation.toUpperCase()} ·{" "}
                    {study.time_spent_minutes > 0
                      ? `${study.time_spent_minutes} minutes`
                      : "study session logged"}{" "}
                    · {study.completed ? "completed" : "in progress"}
                  </p>
                  <p>Logged {formatDateLabel(study.read_at)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="content-card-note">
              As you log reading and study sessions, this section will start surfacing
              your recent momentum automatically.
            </div>
          )}
        </section>
      </section>

      {preferences.visibleWidgets.studySummary ? (
        <section className="content-grid-two">
          {studySummary.map(({ label, value, icon: Icon }) => (
            <article key={label} className="content-stat">
              <span className="content-badge">
                <Icon size={14} />
                {label}
              </span>
              <strong>{value}</strong>
            </article>
          ))}
        </section>
      ) : null}

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Resume reading</p>
            <h2>Pick up where you left off</h2>
          </div>
          {readingProgress ? (
            <div className="content-stack">
              <div className="content-card-note">
                <strong>{readingProgress.reference}</strong>
                <p>
                  {readingProgress.progress.percentComplete}% through the Bible ·{" "}
                  {readingProgress.translation.toUpperCase()}
                </p>
                <p>
                  Last saved{" "}
                  {formatDateLabel(readingProgress.updatedAt)}
                </p>
              </div>
              <div className="content-actions">
                <Link
                  href={`/bible/${encodeURIComponent(readingProgress.book)}/${readingProgress.chapter}`}
                  className="button-primary"
                >
                  Resume reading
                </Link>
                <Link href="/bible" className="button-secondary">
                  Open Bible reader
                </Link>
              </div>
            </div>
          ) : (
            <div className="content-card-note">
              Start reading in the Bible reader and your place will appear here automatically.
            </div>
          )}
        </section>

        {preferences.visibleWidgets.bookmarks ? (
          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Bookmarks</p>
              <h2>Return to important passages</h2>
            </div>
            {bookmarks.length > 0 ? (
              <div className="content-stack">
                {bookmarks.slice(0, 3).map((bookmark) => (
                  <div key={bookmark.id} className="content-card-note">
                    <strong>{bookmark.title || bookmark.reference}</strong>
                    <p>
                      {bookmark.type} · Saved{" "}
                      {new Date(bookmark.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="content-card-note">
                Save verses and passages as you study, and they will appear
                here.
              </div>
            )}
            <Link href="/user/bookmarks" className="button-secondary">
              Open bookmarks
            </Link>
          </section>
        ) : null}

        {preferences.visibleWidgets.prayerRequests ? (
          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Prayer</p>
              <h2>Prayers still in front of you</h2>
            </div>
            {prayerRequests.length > 0 ? (
              <div className="content-stack">
                {prayerRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="content-card-note">
                    <strong>{request.title}</strong>
                    <p>
                      {request.status} · Updated{" "}
                      {formatDateLabel(request.updatedAt)}
                    </p>
                    {request.description ? <p>{request.description}</p> : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="content-card-note">
                Add a prayer request to build your own prayer rhythm here.
              </div>
            )}
            <Link href="/user/prayer-requests" className="button-secondary">
              Open prayer requests
            </Link>
          </section>
        ) : null}

        {preferences.visibleWidgets.emailPreferences ? (
          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Reminders</p>
              <h2>How your encouragement flow is set</h2>
            </div>
            <div className="content-stack">
              <div className="content-card-note">
                <strong>Daily devotional</strong>
                <p>{emailPrefs.dailyDevotional ? "Enabled" : "Off for now"}</p>
              </div>
              <div className="content-card-note">
                <strong>Prayer updates</strong>
                <p>{emailPrefs.prayerUpdates ? "Enabled" : "Off for now"}</p>
              </div>
              <div className="content-card-note">
                <strong>Newsletter</strong>
                <p>{emailPrefs.newsletter ? "Enabled" : "Off for now"}</p>
              </div>
            </div>
            <Link href="/user/settings" className="button-secondary">
              Manage reminders
            </Link>
          </section>
        ) : null}
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Recommendations</p>
          <h2>Next steps based on your current setup</h2>
        </div>
        <div className="content-grid-three">
          {recommendations.map((item) => (
            <article key={item.title} className="content-card">
              <h3 className="content-card-title">{item.title}</h3>
              <p>{item.body}</p>
              <Link href={item.href} className="button-secondary">
                {item.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Expansion</p>
          <h2>New areas to shape the rest of your study flow</h2>
        </div>
        <div className="content-grid-three">
          <article className="content-card">
            <span className="content-badge">
              <WandSparkles size={14} />
              Onboarding
            </span>
            <h3 className="content-card-title">Refine your setup</h3>
            <p>
              Revisit translation, focus, daily target, and dashboard defaults
              in one guided onboarding flow.
            </p>
            <Link href="/onboarding" className="button-secondary">
              Open onboarding
            </Link>
          </article>
          <article className="content-card">
            <span className="content-badge">
              <BellRing size={14} />
              Reminders
            </span>
            <h3 className="content-card-title">Control notifications</h3>
            <p>
              Keep devotional, prayer, and newsletter reminders intentional and
              easy to manage.
            </p>
            <Link href="/notifications" className="button-secondary">
              Manage reminders
            </Link>
          </article>
          <article className="content-card">
            <span className="content-badge">
              <UsersRound size={14} />
              Community
            </span>
            <h3 className="content-card-title">Explore groups and prayer circles</h3>
            <p>
              See how group study, shared prayer, and small-circle rhythms can
              fit the rest of the product.
            </p>
            <Link href="/groups" className="button-secondary">
              Open groups
            </Link>
          </article>
          <article className="content-card">
            <span className="content-badge">
              <BookOpenText size={14} />
              Passage study
            </span>
            <h3 className="content-card-title">Use a deeper passage workspace</h3>
            <p>
              Open a reference with translation comparison, notes, bookmarks,
              and related passages gathered in one place.
            </p>
            <Link
              href={`/passage/${encodeURIComponent("John 3:16")}`}
              className="button-secondary"
            >
              Open passage study
            </Link>
          </article>
          <article className="content-card">
            <span className="content-badge">
              <WandSparkles size={14} />
              CMS
            </span>
            <h3 className="content-card-title">Open the content workspace</h3>
            <p>
              Track drafts, reviews, publishing state, and featured content
              across the site from one admin-friendly surface.
            </p>
            <Link href="/admin/content" className="button-secondary">
              Open CMS
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
