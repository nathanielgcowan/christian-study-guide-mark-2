"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface EmailPrefs {
  dailyDevotional: boolean;
  prayerUpdates: boolean;
  newsletter: boolean;
}

export default function EmailSettingsPage() {
  const { data: session, status } = useSession();
  const [prefs, setPrefs] = useState<EmailPrefs>({
    dailyDevotional: false,
    prayerUpdates: false,
    newsletter: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchPrefs();
    }
  }, [status]);

  async function fetchPrefs() {
    const response = await fetch("/api/user/email-prefs");
    if (response.ok) {
      const data = await response.json();
      setPrefs(data.emailPrefs);
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    const response = await fetch("/api/user/email-prefs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prefs),
    });
    setSaving(false);

    if (response.ok) {
      alert("Email preferences saved!");
    }
  }

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated")
    return <p>Please sign in to manage email preferences.</p>;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-6">
        <Link href="/user/profile" className="text-blue-600 hover:underline">
          ← Back to profile
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold">Email Preferences</h1>

        {loading ? (
          <p>Loading preferences...</p>
        ) : (
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={prefs.dailyDevotional}
                onChange={(e) =>
                  setPrefs({ ...prefs, dailyDevotional: e.target.checked })
                }
                className="h-4 w-4"
              />
              <span className="text-slate-700">Daily devotional emails</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={prefs.prayerUpdates}
                onChange={(e) =>
                  setPrefs({ ...prefs, prayerUpdates: e.target.checked })
                }
                className="h-4 w-4"
              />
              <span className="text-slate-700">Prayer request updates</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={prefs.newsletter}
                onChange={(e) =>
                  setPrefs({ ...prefs, newsletter: e.target.checked })
                }
                className="h-4 w-4"
              />
              <span className="text-slate-700">Weekly newsletter</span>
            </label>

            <div className="pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
