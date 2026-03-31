"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BellRing,
  BookOpenText,
  BookMarked,
  Clock3,
  HeartHandshake,
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
}

interface StudySummary {
  streak: {
    current_streak: number;
    best_streak: number;
    total_studies: number;
  } | null;
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

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [name, setName] = useState("Friend");
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequestItem[]>([]);
  const [studySummaryData, setStudySummaryData] = useState<StudySummary["streak"]>(
    null,
  );
  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(null);

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
      ] =
        await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/user/preferences"),
          fetch("/api/user/bookmarks"),
          fetch("/api/user/prayer-requests"),
          fetch("/api/user/studies"),
          fetch("/api/user/reading-progress"),
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
        const data = (await studiesResponse.json()) as StudySummary;
        setStudySummaryData(data.streak);
      }

      if (readingProgressResponse.ok) {
        const data = (await readingProgressResponse.json()) as {
          readingProgress: ReadingProgress;
        };
        setReadingProgress(data.readingProgress);
      }

      setLoading(false);
    }

    void loadDashboard();
  }, []);

  const studySummary = useMemo(() => {
    const activePrayers = prayerRequests.filter(
      (request) => request.status !== "answered",
    ).length;

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
        icon: Sparkles,
      },
      {
        label: "Open requests",
        value: activePrayers,
        icon: Sparkles,
      },
    ];
  }, [
    bookmarks.length,
    prayerRequests,
    preferences.dailyTargetMinutes,
    studySummaryData?.current_streak,
  ]);

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

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Personal dashboard</p>
        <h1>{name}, here is your study rhythm for today.</h1>
        <p className="content-lead">
          Your dashboard now adapts to your focus goal, preferred translation,
          and the study widgets you want to keep visible.
        </p>
        <div className="content-chip-row">
          <span className="content-chip">Goal: {preferences.focusGoal}</span>
          <span className="content-chip">
            Translation: {preferences.preferredTranslation.toUpperCase()}
          </span>
          <span className="content-chip">
            Target: {preferences.dailyTargetMinutes} minutes
          </span>
        </div>
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
                  {readingProgress.updatedAt
                    ? new Date(readingProgress.updatedAt).toLocaleDateString()
                    : "recently"}
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
                      {new Date(request.updatedAt).toLocaleDateString()}
                    </p>
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
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Recommendations</p>
          <h2>Next steps based on your current setup</h2>
        </div>
        <div className="content-grid-three">
          <article className="content-card">
            <h3 className="content-card-title">Stay consistent</h3>
            <p>
              Open a reading plan that fits your daily target and build a steady
              study cadence.
            </p>
            <Link href="/reading-plans" className="button-secondary">
              Reading plans
            </Link>
          </article>
          <article className="content-card">
            <h3 className="content-card-title">Create shareable Scripture</h3>
            <p>
              Turn a meaningful verse into a simple share image for personal or
              ministry use.
            </p>
            <Link href="/user/verse-generator" className="button-secondary">
              Verse image studio
            </Link>
          </article>
          <article className="content-card">
            <h3 className="content-card-title">Tune your workspace</h3>
            <p>
              Adjust your dashboard goal, translation, and visible widgets in
              settings.
            </p>
            <Link href="/user/settings" className="button-secondary">
              Update settings
            </Link>
          </article>
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
