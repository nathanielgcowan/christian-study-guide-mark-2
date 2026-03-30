"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HeartHandshake, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  user: { name: string | null; email: string };
  prayerCount: number;
  createdAt: string;
}

export default function PrayerRequestsPage() {
  const [signedIn, setSignedIn] = useState(false);
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });

  useEffect(() => {
    async function loadRequests() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSignedIn(Boolean(session));

      const response = await fetch("/api/user/prayer-requests");
      if (response.ok) {
        const data = (await response.json()) as {
          prayerRequests: PrayerRequest[];
        };
        setRequests(data.prayerRequests);
      }
      setLoading(false);
    }

    void loadRequests();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!signedIn) {
      alert("Please sign in first");
      return;
    }

    const response = await fetch("/api/user/prayer-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, isPublic: true }),
    });

    if (response.ok) {
      setFormData({ title: "", description: "" });
      setShowForm(false);

      const reload = await fetch("/api/user/prayer-requests");
      if (reload.ok) {
        const data = (await reload.json()) as {
          prayerRequests: PrayerRequest[];
        };
        setRequests(data.prayerRequests);
      }
    }
  }

  return (
    <main className="minimal-shell">
      <section className="minimal-grid">
        <div className="minimal-section-heading">
          <div className="minimal-hero">
            <p className="eyebrow">Community Prayer</p>
            <h1>Shared prayer requests in a quieter format.</h1>
            <p>
              Read, post, and revisit requests without the heavy dashboard feel.
            </p>
          </div>
          {signedIn ? (
            <button
              onClick={() => setShowForm(!showForm)}
              aria-label="Toggle prayer request form"
              className="button-primary"
            >
              <Plus size={16} />
              {showForm ? "Close form" : "New request"}
            </button>
          ) : null}
        </div>

        {showForm ? (
          <form onSubmit={handleSubmit} className="minimal-card minimal-form">
            <h2>Share a request</h2>
            <div className="minimal-form-grid">
              <div>
                <label className="minimal-label">Title</label>
                <input
                  type="text"
                  placeholder="What should people pray for?"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="minimal-input"
                  required
                />
              </div>
              <div>
                <label className="minimal-label">Description</label>
                <textarea
                  placeholder="Describe your prayer request"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="minimal-textarea"
                  rows={4}
                  required
                />
              </div>
              <div className="minimal-actions">
                <button type="submit" className="button-primary">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="button-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : null}

        {loading ? (
          <p>Loading prayer requests...</p>
        ) : requests.length === 0 ? (
          <section className="minimal-card minimal-empty">
            <HeartHandshake className="mx-auto mb-4 h-10 w-10 text-[var(--accent-strong)]" />
            <h2>No prayer requests yet</h2>
            <p>The first shared request can set the tone for the whole page.</p>
          </section>
        ) : (
          <section className="minimal-list">
            {requests.map((request) => (
              <article key={request.id} className="minimal-item">
                <div>
                  <h3>{request.title}</h3>
                  <p>{request.description}</p>
                  <div className="minimal-meta">
                    <span>By {request.user.name || request.user.email}</span>
                    <span>{request.prayerCount} people praying</span>
                    <span>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        <Link href="/" className="minimal-link">
          Back to home
        </Link>
      </section>
    </main>
  );
}
