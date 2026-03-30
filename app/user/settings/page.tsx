"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BellRing, MailCheck, Newspaper } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface EmailPrefs {
  dailyDevotional: boolean;
  prayerUpdates: boolean;
  newsletter: boolean;
}

interface DashboardPreferences {
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

export default function EmailSettingsPage() {
  const [prefs, setPrefs] = useState<EmailPrefs>({
    dailyDevotional: false,
    prayerUpdates: false,
    newsletter: false,
  });
  const [preferences, setPreferences] = useState<DashboardPreferences>({
    focusGoal: "consistency",
    preferredTranslation: "web",
    dailyTargetMinutes: 20,
    visibleWidgets: {
      bookmarks: true,
      prayerRequests: true,
      emailPreferences: true,
      studySummary: true,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    async function loadPrefs() {
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
      const [emailResponse, preferencesResponse] = await Promise.all([
        fetch("/api/user/email-prefs"),
        fetch("/api/user/preferences"),
      ]);

      if (emailResponse.ok) {
        const data = (await emailResponse.json()) as { emailPrefs: EmailPrefs };
        setPrefs(data.emailPrefs);
      }

      if (preferencesResponse.ok) {
        const data = (await preferencesResponse.json()) as {
          preferences: DashboardPreferences;
        };
        setPreferences(data.preferences);
      }
      setLoading(false);
    }

    void loadPrefs();
  }, []);

  async function handleSave() {
    setSaving(true);
    const [emailResponse, preferencesResponse] = await Promise.all([
      fetch("/api/user/email-prefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      }),
      fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      }),
    ]);
    setSaving(false);

    if (emailResponse.ok && preferencesResponse.ok) {
      alert("Email preferences saved!");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!signedIn)
    return (
      <main className="minimal-shell">
        <section className="minimal-card minimal-status">
          <h2>Please sign in to manage email preferences.</h2>
          <div className="minimal-actions">
            <Link href="/auth/signin" className="button-primary">
              Sign in
            </Link>
          </div>
        </section>
      </main>
    );

  return (
    <main className="minimal-shell">
      <section className="minimal-grid minimal-grid-two">
        <div className="minimal-hero">
          <p className="eyebrow">Preferences</p>
          <h1>Keep notifications intentional.</h1>
          <p>
            Choose only the updates that help you stay engaged without creating
            more inbox noise.
          </p>
        </div>

        <div className="minimal-card minimal-form">
          <h2>Email preferences</h2>
          <div className="minimal-form-grid">
            <div>
              <label className="minimal-label">Focus goal</label>
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
            </div>

            <div>
              <label className="minimal-label">Preferred translation</label>
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
            </div>

            <div>
              <label className="minimal-label">Daily target minutes</label>
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
            </div>

            <label className="minimal-item">
              <span>
                <strong className="minimal-link">Daily devotional</strong>
                <p>Receive a simple devotional rhythm by email.</p>
              </span>
              <span className="minimal-badge">
                <MailCheck size={14} />
                <input
                  type="checkbox"
                  checked={prefs.dailyDevotional}
                  onChange={(e) =>
                    setPrefs({ ...prefs, dailyDevotional: e.target.checked })
                  }
                  className="h-4 w-4"
                />
              </span>
            </label>

            <label className="minimal-item">
              <span>
                <strong className="minimal-link">Prayer updates</strong>
                <p>Know when shared prayer activity changes.</p>
              </span>
              <span className="minimal-badge">
                <BellRing size={14} />
                <input
                  type="checkbox"
                  checked={prefs.prayerUpdates}
                  onChange={(e) =>
                    setPrefs({ ...prefs, prayerUpdates: e.target.checked })
                  }
                  className="h-4 w-4"
                />
              </span>
            </label>

            <label className="minimal-item">
              <span>
                <strong className="minimal-link">Newsletter</strong>
                <p>Get broader updates and product news.</p>
              </span>
              <span className="minimal-badge">
                <Newspaper size={14} />
                <input
                  type="checkbox"
                  checked={prefs.newsletter}
                  onChange={(e) =>
                    setPrefs({ ...prefs, newsletter: e.target.checked })
                  }
                  className="h-4 w-4"
                />
              </span>
            </label>

            <label className="minimal-item">
              <span>
                <strong className="minimal-link">Dashboard study summary</strong>
                <p>Show the overview cards on your dashboard.</p>
              </span>
              <span className="minimal-badge">
                <MailCheck size={14} />
                <input
                  type="checkbox"
                  checked={preferences.visibleWidgets.studySummary}
                  onChange={(event) =>
                    setPreferences({
                      ...preferences,
                      visibleWidgets: {
                        ...preferences.visibleWidgets,
                        studySummary: event.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
              </span>
            </label>

            <label className="minimal-item">
              <span>
                <strong className="minimal-link">Bookmark widget</strong>
                <p>Keep saved passages visible on your dashboard.</p>
              </span>
              <span className="minimal-badge">
                <MailCheck size={14} />
                <input
                  type="checkbox"
                  checked={preferences.visibleWidgets.bookmarks}
                  onChange={(event) =>
                    setPreferences({
                      ...preferences,
                      visibleWidgets: {
                        ...preferences.visibleWidgets,
                        bookmarks: event.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
              </span>
            </label>

            <label className="minimal-item">
              <span>
                <strong className="minimal-link">Prayer widget</strong>
                <p>Keep prayer requests visible on your dashboard.</p>
              </span>
              <span className="minimal-badge">
                <MailCheck size={14} />
                <input
                  type="checkbox"
                  checked={preferences.visibleWidgets.prayerRequests}
                  onChange={(event) =>
                    setPreferences({
                      ...preferences,
                      visibleWidgets: {
                        ...preferences.visibleWidgets,
                        prayerRequests: event.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
              </span>
            </label>

            <div className="minimal-actions">
              <button
                onClick={handleSave}
                disabled={saving}
                className="button-primary"
              >
                {saving ? "Saving..." : "Save preferences"}
              </button>
              <Link href="/user/profile" className="button-secondary">
                Back to profile
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
