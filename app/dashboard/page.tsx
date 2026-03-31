"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BellRing,
  BookOpenText,
  BookMarked,
  Clock3,
  Flame,
  HeartHandshake,
  NotebookPen,
  Plus,
  CheckCheck,
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

interface NoteItem {
  id: string;
  reference: string;
  content: string;
  noteType: string;
  color: string;
  updatedAt: string;
  tags: string[];
}

interface UserPlanProgress {
  plan_id: string;
  current_day: number;
  completed: boolean;
  completed_at: string | null;
  updated_at?: string | null;
}

interface DashboardActionState {
  note: string | null;
  prayer: string | null;
  plan: string | null;
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

const readingPlanCatalog: Record<
  string,
  { title: string; duration: string; difficulty: string; days: number }
> = {
  "new-testament-30-days": {
    title: "New Testament in 30 Days",
    duration: "30 days",
    difficulty: "Beginner",
    days: 30,
  },
  "psalms-wisdom": {
    title: "Psalms & Wisdom Literature",
    duration: "21 days",
    difficulty: "Intermediate",
    days: 21,
  },
  "gospel-jesus": {
    title: "The Life of Jesus",
    duration: "14 days",
    difficulty: "Beginner",
    days: 14,
  },
  "old-testament-overview": {
    title: "Old Testament Overview",
    duration: "90 days",
    difficulty: "Advanced",
    days: 90,
  },
  "epistles-paul": {
    title: "Paul's Letters",
    duration: "45 days",
    difficulty: "Intermediate",
    days: 45,
  },
  "daily-psalms": {
    title: "Daily Psalms",
    duration: "30 days",
    difficulty: "Beginner",
    days: 30,
  },
};

const quickLinks = [
  {
    title: "Open Bible reader",
    body: "Jump straight into the next chapter without losing momentum.",
    href: "/bible",
  },
  {
    title: "Capture a note",
    body: "Save an observation, question, or application while it is fresh.",
    href: "/journal",
  },
  {
    title: "Compare translations",
    body: "Use the comparison view when a verse needs closer attention.",
    href: "/verse-comparison",
  },
  {
    title: "Review prayer requests",
    body: "Keep prayer follow-up near the rest of your study rhythm.",
    href: "/user/prayer-requests",
  },
];

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
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [readingPlans, setReadingPlans] = useState<UserPlanProgress[]>([]);
  const [quickNoteReference, setQuickNoteReference] = useState("John 3:16");
  const [quickNoteContent, setQuickNoteContent] = useState("");
  const [savingQuickNote, setSavingQuickNote] = useState(false);
  const [updatingPrayerId, setUpdatingPrayerId] = useState<string | null>(null);
  const [updatingPlanId, setUpdatingPlanId] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<DashboardActionState>({
    note: null,
    prayer: null,
    plan: null,
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
        notesResponse,
        readingPlansResponse,
      ] =
        await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/user/preferences"),
          fetch("/api/user/bookmarks"),
          fetch("/api/user/prayer-requests?scope=mine"),
          fetch("/api/user/studies"),
          fetch("/api/user/reading-progress"),
          fetch("/api/user/email-prefs"),
          fetch("/api/user/notes"),
          fetch("/api/user/reading-plans"),
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

      if (notesResponse.ok) {
        const data = (await notesResponse.json()) as { notes: NoteItem[] };
        setNotes(data.notes);
      }

      if (readingPlansResponse.ok) {
        const data = (await readingPlansResponse.json()) as {
          plans: UserPlanProgress[];
        };
        setReadingPlans(data.plans);
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

  const activePlan = useMemo(() => {
    const nextPlan = [...readingPlans]
      .filter((plan) => !plan.completed)
      .sort((left, right) => {
        const leftDate = new Date(left.updated_at ?? 0).getTime();
        const rightDate = new Date(right.updated_at ?? 0).getTime();
        return rightDate - leftDate;
      })[0];

    if (!nextPlan) {
      return null;
    }

      return {
        ...nextPlan,
        meta: readingPlanCatalog[nextPlan.plan_id] ?? {
          title: nextPlan.plan_id,
          duration: "Structured plan",
          difficulty: "Guided",
          days: Math.max(nextPlan.current_day, 1),
        },
      };
  }, [readingPlans]);

  const completedPlansCount = useMemo(
    () => readingPlans.filter((plan) => plan.completed).length,
    [readingPlans],
  );

  const studyMomentumLabel = useMemo(() => {
    const streak = studySummaryData?.current_streak ?? 0;
    if (streak >= 14) return "Strong momentum";
    if (streak >= 5) return "Healthy rhythm";
    if (streak >= 1) return "Momentum building";
    return "Fresh start";
  }, [studySummaryData?.current_streak]);

  const suggestedPlans = useMemo(() => {
    const enrolled = new Set(readingPlans.map((plan) => plan.plan_id));
    return Object.entries(readingPlanCatalog)
      .filter(([planId]) => !enrolled.has(planId))
      .slice(0, 3)
      .map(([planId, meta]) => ({ planId, ...meta }));
  }, [readingPlans]);

  const activePrayerRequests = useMemo(
    () => prayerRequests.filter((request) => request.status !== "answered").slice(0, 3),
    [prayerRequests],
  );

  async function handleQuickNoteSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!quickNoteReference.trim() || !quickNoteContent.trim()) {
      setActionStatus((current) => ({
        ...current,
        note: "Reference and note content are required.",
      }));
      return;
    }

    setSavingQuickNote(true);
    setActionStatus((current) => ({ ...current, note: null }));

    const response = await fetch("/api/user/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: quickNoteReference.trim(),
        content: quickNoteContent.trim(),
        noteType: "note",
      }),
    });

    setSavingQuickNote(false);

    if (!response.ok) {
      setActionStatus((current) => ({
        ...current,
        note: "Could not save the note right now.",
      }));
      return;
    }

    const note = (await response.json()) as NoteItem;
    setNotes((current) => [note, ...current]);
    setQuickNoteContent("");
    setActionStatus((current) => ({
      ...current,
      note: "Note saved to your study workspace.",
    }));
  }

  async function handleMarkPrayerAnswered(id: string) {
    setUpdatingPrayerId(id);
    setActionStatus((current) => ({ ...current, prayer: null }));

    const response = await fetch("/api/user/prayer-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, answered: true }),
    });

    setUpdatingPrayerId(null);

    if (!response.ok) {
      setActionStatus((current) => ({
        ...current,
        prayer: "Could not update that prayer request right now.",
      }));
      return;
    }

    const data = (await response.json()) as { prayerRequest: PrayerRequestItem };
    setPrayerRequests((current) =>
      current.map((item) => (item.id === id ? data.prayerRequest : item)),
    );
    setActionStatus((current) => ({
      ...current,
      prayer: "Prayer request marked as answered.",
    }));
  }

  async function handleStartPlan(planId: string) {
    setUpdatingPlanId(planId);
    setActionStatus((current) => ({ ...current, plan: null }));

    const response = await fetch("/api/user/reading-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });

    setUpdatingPlanId(null);

    if (!response.ok) {
      setActionStatus((current) => ({
        ...current,
        plan: "Could not start that reading plan right now.",
      }));
      return;
    }

    const data = (await response.json()) as { plan: UserPlanProgress };
    setReadingPlans((current) => [data.plan, ...current.filter((item) => item.plan_id !== planId)]);
    setActionStatus((current) => ({
      ...current,
      plan: "Reading plan started.",
    }));
  }

  async function handleAdvancePlan(planId: string, currentDay: number, completed = false) {
    setUpdatingPlanId(planId);
    setActionStatus((current) => ({ ...current, plan: null }));

    const response = await fetch(`/api/user/reading-plans/${planId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentDay,
        completed,
      }),
    });

    setUpdatingPlanId(null);

    if (!response.ok) {
      setActionStatus((current) => ({
        ...current,
        plan: "Could not update that plan right now.",
      }));
      return;
    }

    const data = (await response.json()) as { plan: UserPlanProgress };
    setReadingPlans((current) =>
      current.map((item) => (item.plan_id === planId ? data.plan : item)),
    );
    setActionStatus((current) => ({
      ...current,
      plan: completed
        ? "Reading plan marked complete."
        : `Advanced to day ${data.plan.current_day}.`,
    }));
  }

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
          <span className="content-chip">{studyMomentumLabel}</span>
          <span className="content-chip">Goal: {preferences.focusGoal}</span>
          <span className="content-chip">
            Translation: {preferences.preferredTranslation.toUpperCase()}
          </span>
          <span className="content-chip">
            Target: {preferences.dailyTargetMinutes} minutes
          </span>
        </div>
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Quick launch</p>
          <h2>Open the part of the workspace you need most</h2>
        </div>
        <div className="content-grid-three">
          {quickLinks.map((item) => (
            <article key={item.title} className="content-card">
              <h3 className="content-card-title">{item.title}</h3>
              <p>{item.body}</p>
              <Link href={item.href} className="button-secondary">
                Open
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Action center</p>
          <h2>Take the next step without leaving the dashboard</h2>
        </div>
        <div className="content-grid-three">
          <form onSubmit={handleQuickNoteSave} className="content-card">
            <span className="content-badge">
              <NotebookPen size={14} />
              Quick note
            </span>
            <h3 className="content-card-title">Capture one study insight</h3>
            <div className="minimal-form-grid">
              <input
                value={quickNoteReference}
                onChange={(event) => setQuickNoteReference(event.target.value)}
                className="minimal-input"
                placeholder="Reference"
              />
              <textarea
                value={quickNoteContent}
                onChange={(event) => setQuickNoteContent(event.target.value)}
                className="minimal-textarea"
                rows={5}
                placeholder="Write an observation, question, or application."
              />
            </div>
            <button type="submit" disabled={savingQuickNote} className="button-primary">
              {savingQuickNote ? "Saving..." : "Save note"}
            </button>
            {actionStatus.note ? <p className="share-status">{actionStatus.note}</p> : null}
          </form>

          <section className="content-card">
            <span className="content-badge">
              <CheckCheck size={14} />
              Prayer follow-up
            </span>
            <h3 className="content-card-title">Mark answered requests</h3>
            {activePrayerRequests.length > 0 ? (
              <div className="content-stack">
                {activePrayerRequests.map((request) => (
                  <div key={request.id} className="content-card-note">
                    <strong>{request.title}</strong>
                    {request.description ? <p>{request.description}</p> : null}
                    <button
                      type="button"
                      onClick={() => void handleMarkPrayerAnswered(request.id)}
                      disabled={updatingPrayerId === request.id}
                      className="button-secondary"
                    >
                      {updatingPrayerId === request.id ? "Updating..." : "Mark answered"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="content-card-note">
                No active prayer requests are waiting here right now.
              </div>
            )}
            {actionStatus.prayer ? <p className="share-status">{actionStatus.prayer}</p> : null}
          </section>

          <section className="content-card">
            <span className="content-badge">
              <Plus size={14} />
              Start a plan
            </span>
            <h3 className="content-card-title">Begin a guided reading path</h3>
            {suggestedPlans.length > 0 ? (
              <div className="content-stack">
                {suggestedPlans.map((plan) => (
                  <div key={plan.planId} className="content-card-note">
                    <strong>{plan.title}</strong>
                    <p>
                      {plan.duration} · {plan.difficulty}
                    </p>
                    <button
                      type="button"
                      onClick={() => void handleStartPlan(plan.planId)}
                      disabled={updatingPlanId === plan.planId}
                      className="button-secondary"
                    >
                      {updatingPlanId === plan.planId ? "Starting..." : "Start plan"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="content-card-note">
                You are already enrolled in the available starter plans. Keep going or build a custom path.
              </div>
            )}
            {actionStatus.plan ? <p className="share-status">{actionStatus.plan}</p> : null}
          </section>
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
            <p className="eyebrow">Reading plans</p>
            <h2>Your structured path</h2>
          </div>
          {activePlan ? (
            <div className="content-stack">
              <div className="content-card-note">
                <strong>{activePlan.meta.title}</strong>
                <p>
                  Day {activePlan.current_day} in progress · {activePlan.meta.duration} ·{" "}
                  {activePlan.meta.difficulty}
                </p>
                <p>Last touched {formatDateLabel(activePlan.updated_at)}</p>
              </div>
              <div className="content-chip-row">
                <span className="content-chip">
                  {readingPlans.length} enrolled plan
                  {readingPlans.length === 1 ? "" : "s"}
                </span>
                <span className="content-chip">
                  {completedPlansCount} completed
                </span>
              </div>
              <div className="content-actions">
                <Link href="/reading-plans" className="button-primary">
                  Continue plans
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    void handleAdvancePlan(
                      activePlan.plan_id,
                      Math.min(activePlan.current_day + 1, activePlan.meta.days),
                      false,
                    )
                  }
                  disabled={updatingPlanId === activePlan.plan_id}
                  className="button-secondary"
                >
                  {updatingPlanId === activePlan.plan_id ? "Updating..." : "Advance one day"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    void handleAdvancePlan(activePlan.plan_id, activePlan.current_day, true)
                  }
                  disabled={updatingPlanId === activePlan.plan_id}
                  className="button-secondary"
                >
                  Complete plan
                </button>
                <Link href="/reading-plans/custom" className="button-secondary">
                  Build custom plan
                </Link>
              </div>
            </div>
          ) : (
            <div className="content-stack">
              <div className="content-card-note">
                Start a guided plan and the dashboard will keep your current path visible here.
              </div>
              <div className="content-actions">
                <Link href="/reading-plans" className="button-primary">
                  Browse plans
                </Link>
                <Link href="/reading-plans/custom" className="button-secondary">
                  Create custom plan
                </Link>
              </div>
            </div>
          )}
        </section>

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
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Notes</p>
            <h2>Your recent study workspace</h2>
          </div>
          {notes.length > 0 ? (
            <div className="content-stack">
              {notes.slice(0, 3).map((note) => (
                <div key={note.id} className="content-card-note">
                  <strong>{note.reference}</strong>
                  <p>{note.content}</p>
                  <p>
                    {note.noteType} · Updated {formatDateLabel(note.updatedAt)}
                  </p>
                  {note.tags.length > 0 ? <p>Tags: {note.tags.join(", ")}</p> : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="content-card-note">
              Save notes from your reading and passage study pages to build a searchable record here.
            </div>
          )}
          <div className="content-actions">
            <Link href="/journal" className="button-primary">
              Open journal
            </Link>
            <Link href="/passage/John%203%3A16" className="button-secondary">
              Open passage workspace
            </Link>
          </div>
        </section>

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
        <div className="content-actions">
          <Link href="/user/settings" className="button-secondary">
            Personalize this dashboard
          </Link>
          <Link href="/onboarding" className="button-secondary">
            Revisit onboarding
          </Link>
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
          <article className="content-card">
            <span className="content-badge">
              <ArrowRight size={14} />
              Workspace
            </span>
            <h3 className="content-card-title">Deepen your daily flow</h3>
            <p>
              Move between reading, notes, bookmarks, and prayer without leaving
              your personal command center behind.
            </p>
            <Link href="/dashboard" className="button-secondary">
              Stay on dashboard
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
