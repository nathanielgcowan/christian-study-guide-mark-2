"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BellRing, MailCheck, Newspaper, Smartphone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface EmailPrefs {
  dailyDevotional: boolean;
  prayerUpdates: boolean;
  newsletter: boolean;
}

const defaultPrefs: EmailPrefs = {
  dailyDevotional: false,
  prayerUpdates: false,
  newsletter: false,
};

export default function NotificationsPage() {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState<EmailPrefs>(defaultPrefs);

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

      const response = await fetch("/api/user/email-prefs");
      if (response.ok) {
        const data = (await response.json()) as { emailPrefs: EmailPrefs };
        setPrefs(data.emailPrefs);
      }

      setLoading(false);
    }

    void load();
  }, []);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/user/email-prefs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prefs),
    });
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="page-shell content-shell-narrow">
        <section className="content-card">
          <h2>Loading notifications...</h2>
        </section>
      </main>
    );
  }

  if (!signedIn) {
    return (
      <main className="page-shell content-shell-narrow content-stack">
        <section className="content-hero">
          <p className="eyebrow">Notifications</p>
          <h1>Sign in to manage your reminder flow.</h1>
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
        <p className="eyebrow">Notifications</p>
        <h1>Keep reminders calm, useful, and easy to trust.</h1>
        <p className="content-lead">
          Turn on only the notifications that help you stay in rhythm without
          flooding your inbox.
        </p>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Email reminders</p>
            <h2>What should reach you?</h2>
          </div>
          <div className="content-stack">
            <label className="minimal-item">
              <span>
                <strong className="minimal-link">Daily devotional</strong>
                <p>A simple reading nudge for the next faithful step.</p>
              </span>
              <span className="minimal-badge">
                <MailCheck size={14} />
                <input
                  type="checkbox"
                  checked={prefs.dailyDevotional}
                  onChange={(event) =>
                    setPrefs({
                      ...prefs,
                      dailyDevotional: event.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />
              </span>
            </label>
            <label className="minimal-item">
              <span>
                <strong className="minimal-link">Prayer updates</strong>
                <p>Follow activity around your prayer rhythm.</p>
              </span>
              <span className="minimal-badge">
                <BellRing size={14} />
                <input
                  type="checkbox"
                  checked={prefs.prayerUpdates}
                  onChange={(event) =>
                    setPrefs({
                      ...prefs,
                      prayerUpdates: event.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />
              </span>
            </label>
            <label className="minimal-item">
              <span>
                <strong className="minimal-link">Newsletter</strong>
                <p>Hear about new tools, content, and featured study tracks.</p>
              </span>
              <span className="minimal-badge">
                <Newspaper size={14} />
                <input
                  type="checkbox"
                  checked={prefs.newsletter}
                  onChange={(event) =>
                    setPrefs({
                      ...prefs,
                      newsletter: event.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />
              </span>
            </label>
          </div>
          <div className="content-actions">
            <button
              type="button"
              className="button-primary"
              onClick={() => void handleSave()}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save reminders"}
            </button>
            <Link href="/user/settings" className="button-secondary">
              Open settings
            </Link>
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Coming next</p>
            <h2>Reminder channels ready for expansion</h2>
          </div>
          <div className="content-stack">
            <div className="content-card-note">
              <strong>Push reminders</strong>
              <p>
                Prepare installable, mobile-first reminders once the service
                worker and offline layer expand.
              </p>
            </div>
            <div className="content-card-note">
              <strong>Smart timing</strong>
              <p>
                Tie devotional reminders to your preferred reading rhythm and
                target minutes.
              </p>
            </div>
            <div className="content-card-note">
              <strong>Group follow-up</strong>
              <p>
                Surface prayer-circle and shared-study updates in one calmer
                stream.
              </p>
            </div>
          </div>
          <span className="content-badge">
            <Smartphone size={14} />
            PWA-ready direction
          </span>
        </section>
      </section>
    </main>
  );
}
