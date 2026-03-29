"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session]);

  async function handleUpdate() {
    setSaving(true);
    const response = await fetch("/api/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio }),
    });
    setSaving(false);

    if (response.ok) {
      alert("Profile updated!");
    } else {
      alert("Failed to update profile");
    }
  }

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated")
    return <p>Please sign in to view your profile.</p>;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back home
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold">Your Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              rows={4}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
            <Link
              href="/user/settings"
              className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
            >
              Email Preferences
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
