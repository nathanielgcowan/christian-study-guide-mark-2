"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { LogOut, Mail, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ProfileResponse {
  name: string | null;
  email: string;
  bio: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      setUser(session.user);

      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const profile = (await response.json()) as ProfileResponse;
        setName(profile.name ?? "");
        setBio(profile.bio ?? "");
      } else {
        setName(session.user.user_metadata?.full_name ?? "");
      }

      setLoading(false);
    }

    void loadProfile();
  }, []);

  async function handleUpdate() {
    setSaving(true);
    const response = await fetch("/api/user/profile", {
      method: "PATCH",
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

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <main className="minimal-shell">
        <section className="minimal-card minimal-status">
          <h2>Please sign in to view your profile.</h2>
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
    <main className="minimal-shell">
      <section className="minimal-grid minimal-grid-two">
        <div className="minimal-hero">
          <p className="eyebrow">Profile</p>
          <h1>Your account, simplified.</h1>
          <p>
            Keep only the details that matter close at hand, with less visual
            noise and more room to focus on study.
          </p>
          <div className="minimal-actions">
            <span className="minimal-badge">
              <UserRound size={14} />
              {name || "Member"}
            </span>
            <span className="minimal-badge">
              <Mail size={14} />
              {user.email}
            </span>
          </div>
        </div>

        <div className="minimal-card minimal-form">
          <h2>Edit details</h2>
          <div className="minimal-form-grid">
            <div>
              <label className="minimal-label">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="minimal-input"
              />
            </div>

            <div>
              <label className="minimal-label">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="minimal-textarea"
                rows={4}
              />
            </div>

            <div className="minimal-actions">
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="button-primary"
              >
                {saving ? "Saving..." : "Save profile"}
              </button>
              <Link href="/user/settings" className="button-secondary">
                Preferences
              </Link>
              <button
                onClick={() => {
                  const supabase = createClient();
                  void supabase.auth.signOut().then(() => router.push("/"));
                }}
                className="button-secondary"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
