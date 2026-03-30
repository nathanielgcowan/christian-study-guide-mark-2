"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, BellRing, BookOpenText, Sparkles } from "lucide-react";
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

interface EmailPrefs {
  dailyDevotional: boolean;
  prayerUpdates: boolean;
  newsletter: boolean;
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

const defaultEmailPrefs: EmailPrefs = {
  dailyDevotional: true,
  prayerUpdates: true,
  newsletter: false,
};

export default function OnboardingPage() {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const [emailPrefs, setEmailPrefs] = useState<EmailPrefs>(defaultEmailPrefs);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      setSignedIn(true);

      const [prefsResponse, emailResponse] = await Promise.all([
        fetch("/api/user/preferences"),
        fetch("/api/user/email-prefs"),
      ]);

      if (prefsResponse.ok) {
        const data = (await prefsResponse.json()) as { preferences: Preferences };
        setPreferences(data.preferences);
      }

      if (emailResponse.ok) {
        const data = (await emailResponse.json()) as { emailPrefs: EmailPrefs };
        setEmailPrefs(data.emailPrefs);
      }

      setLoading(false);
    }

    void load();
  }, []);

  async function handleSave() {
    setSaving(true);
    const [prefsResponse, emailResponse] = await Promise.all([
      fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      }),
      fetch("/api/user/email-prefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailPrefs),
      }),
    ]);

    setSaving(false);

    if (prefsResponse.ok && emailResponse.ok) {
      router.push("/dashboard");
      router.refresh();
    }
  }

  if (loading) {
    return (
      <main className="page-shell content-shell-narrow">
        <section className="content-card">
          <h2>Loading onboarding...</h2>
        </section>
      </main>
    );
  }

  if (!signedIn) {
    return (
      <main className="page-shell content-shell-narrow content-stack">
        <section className="content-hero">
          <p className="eyebrow">Onboarding</p>
          <h1>Set your study rhythm before you begin.</h1>
          <p className="content-lead">
            Sign in first so we can save your translation, goals, reminders,
            and dashboard preferences.
          </p>
        </section>
        <section className="content-card">
          <div className="content-actions">
            <Link href="/auth/signin" className="button-primary">
              Sign in
            </Link>
            <Link href="/auth/register" className="button-secondary">
              Create account
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Onboarding</p>
        <h1>Shape a study workspace that feels personal from day one.</h1>
        <p className="content-lead">
          Choose your translation, focus, pace, and reminder style so the rest
          of the app adapts around the way you actually want to grow.
        </p>
      </section>

      <section className="content-grid-three">
        <article className="content-card">
          <span className="content-badge">
            <BookOpenText size={14} />
            Translation
          </span>
          <h2>Read in the version you trust most.</h2>
          <select
            value={preferences.preferredTranslation}
            onChange={(event) =>
              setPreferences({
                ...preferences,
                preferredTranslation: event.target.value,
              })
            }
            className="minimal-select"
          >
            <option value="web">WEB</option>
            <option value="kjv">KJV</option>
            <option value="asv">ASV</option>
          </select>
        </article>

        <article className="content-card">
          <span className="content-badge">
            <Sparkles size={14} />
            Focus
          </span>
          <h2>Pick the rhythm you want this season.</h2>
          <select
            value={preferences.focusGoal}
            onChange={(event) =>
              setPreferences({
                ...preferences,
                focusGoal: event.target.value,
              })
            }
            className="minimal-select"
          >
            <option value="consistency">Consistency</option>
            <option value="depth">Depth</option>
            <option value="prayer">Prayer</option>
            <option value="memory">Memory</option>
          </select>
        </article>

        <article className="content-card">
          <span className="content-badge">
            <BellRing size={14} />
            Daily pace
          </span>
          <h2>Set a target that feels sustainable.</h2>
          <input
            type="number"
            min={5}
            max={120}
            value={preferences.dailyTargetMinutes}
            onChange={(event) =>
              setPreferences({
                ...preferences,
                dailyTargetMinutes: Number(event.target.value) || 20,
              })
            }
            className="minimal-input"
          />
        </article>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Reminders</p>
            <h2>Keep only the nudges that help.</h2>
          </div>
          <div className="content-stack">
            <label className="minimal-item">
              <span>
                <strong className="minimal-link">Daily devotional</strong>
                <p>Receive a simple reading reminder by email.</p>
              </span>
              <input
                type="checkbox"
                checked={emailPrefs.dailyDevotional}
                onChange={(event) =>
                  setEmailPrefs({
                    ...emailPrefs,
                    dailyDevotional: event.target.checked,
                  })
                }
                className="h-4 w-4"
              />
            </label>
            <label className="minimal-item">
              <span>
                <strong className="minimal-link">Prayer updates</strong>
                <p>Get notified when prayer activity changes.</p>
              </span>
              <input
                type="checkbox"
                checked={emailPrefs.prayerUpdates}
                onChange={(event) =>
                  setEmailPrefs({
                    ...emailPrefs,
                    prayerUpdates: event.target.checked,
                  })
                }
                className="h-4 w-4"
              />
            </label>
            <label className="minimal-item">
              <span>
                <strong className="minimal-link">Newsletter</strong>
                <p>Hear about new study tools and featured content.</p>
              </span>
              <input
                type="checkbox"
                checked={emailPrefs.newsletter}
                onChange={(event) =>
                  setEmailPrefs({
                    ...emailPrefs,
                    newsletter: event.target.checked,
                  })
                }
                className="h-4 w-4"
              />
            </label>
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Workspace</p>
            <h2>Choose what stays visible on your dashboard.</h2>
          </div>
          <div className="content-chip-row">
            <button
              type="button"
              className={
                preferences.visibleWidgets.studySummary
                  ? "button-primary"
                  : "button-secondary"
              }
              onClick={() =>
                setPreferences({
                  ...preferences,
                  visibleWidgets: {
                    ...preferences.visibleWidgets,
                    studySummary: !preferences.visibleWidgets.studySummary,
                  },
                })
              }
            >
              Study summary
            </button>
            <button
              type="button"
              className={
                preferences.visibleWidgets.bookmarks
                  ? "button-primary"
                  : "button-secondary"
              }
              onClick={() =>
                setPreferences({
                  ...preferences,
                  visibleWidgets: {
                    ...preferences.visibleWidgets,
                    bookmarks: !preferences.visibleWidgets.bookmarks,
                  },
                })
              }
            >
              Bookmarks
            </button>
            <button
              type="button"
              className={
                preferences.visibleWidgets.prayerRequests
                  ? "button-primary"
                  : "button-secondary"
              }
              onClick={() =>
                setPreferences({
                  ...preferences,
                  visibleWidgets: {
                    ...preferences.visibleWidgets,
                    prayerRequests: !preferences.visibleWidgets.prayerRequests,
                  },
                })
              }
            >
              Prayer requests
            </button>
          </div>
          <p className="content-card-note">
            You can change all of this later from settings, but it is helpful to
            give the dashboard a strong starting point now.
          </p>
        </section>
      </section>

      <section className="content-card">
        <div className="content-actions">
          <button
            type="button"
            onClick={() => void handleSave()}
            className="button-primary"
            disabled={saving}
          >
            {saving ? "Saving setup..." : "Finish onboarding"}
            <ArrowRight size={16} />
          </button>
          <Link href="/dashboard" className="button-secondary">
            Skip to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
