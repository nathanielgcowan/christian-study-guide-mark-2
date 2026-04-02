"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HeartHandshake, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createTestimonyDraftFromPrayer } from "@/lib/client-features";

type PrayerRequestVisibility = "private" | "group" | "public";

interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  user?: { name: string | null; email: string };
  prayerCount?: number;
  createdAt: string;
  updatedAt?: string;
  status?: "active" | "answered";
  visibility?: PrayerRequestVisibility;
  groupSlug?: string | null;
}

interface GroupItem {
  slug: string;
  title: string;
}

export default function PrayerRequestsPage() {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);
  const [publicRequests, setPublicRequests] = useState<PrayerRequest[]>([]);
  const [myRequests, setMyRequests] = useState<PrayerRequest[]>([]);
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "public" as PrayerRequestVisibility,
    groupSlug: "",
  });

  useEffect(() => {
    async function loadRequests() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const isSignedIn = Boolean(session);
      setSignedIn(isSignedIn);

      const publicResponse = await fetch("/api/user/prayer-requests");
      if (publicResponse.ok) {
        const data = (await publicResponse.json()) as {
          prayerRequests: PrayerRequest[];
        };
        setPublicRequests(data.prayerRequests);
      }

      if (isSignedIn) {
        const [mineResponse, groupsResponse] = await Promise.all([
          fetch("/api/user/prayer-requests?scope=mine"),
          fetch("/api/groups"),
        ]);

        if (mineResponse.ok) {
          const data = (await mineResponse.json()) as {
            prayerRequests: PrayerRequest[];
          };
          setMyRequests(data.prayerRequests);
        }

        if (groupsResponse.ok) {
          const data = (await groupsResponse.json()) as { groups: GroupItem[] };
          setGroups(data.groups);
        }
      }

      setLoading(false);
    }

    void loadRequests();
  }, []);

  async function reloadMine() {
    const response = await fetch("/api/user/prayer-requests?scope=mine");
    if (!response.ok) return;
    const data = (await response.json()) as { prayerRequests: PrayerRequest[] };
    setMyRequests(data.prayerRequests);
  }

  async function reloadPublic() {
    const response = await fetch("/api/user/prayer-requests");
    if (!response.ok) return;
    const data = (await response.json()) as { prayerRequests: PrayerRequest[] };
    setPublicRequests(data.prayerRequests);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!signedIn) {
      alert("Please sign in first");
      return;
    }

    const response = await fetch("/api/user/prayer-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        visibility: formData.visibility,
        groupSlug: formData.visibility === "group" ? formData.groupSlug || null : null,
      }),
    });

    if (response.ok) {
      setFormData({
        title: "",
        description: "",
        visibility: "public",
        groupSlug: "",
      });
      setShowForm(false);
      await Promise.all([reloadMine(), reloadPublic()]);
    }
  }

  async function markAnswered(request: PrayerRequest) {
    const response = await fetch("/api/user/prayer-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: request.id,
        answered: true,
        visibility: request.visibility ?? "private",
        groupSlug: request.groupSlug ?? null,
      }),
    });

    if (response.ok) {
      await reloadMine();
    }
  }

  function convertToTestimony(request: PrayerRequest) {
    const draft = createTestimonyDraftFromPrayer({
      id: request.id,
      title: request.title,
      description: request.description,
    });

    router.push(`/testimonies/new?draft=${encodeURIComponent(draft.id)}`);
  }

  function visibilityLabel(request: PrayerRequest) {
    if (request.visibility === "group") {
      return request.groupSlug ? `Group-only · ${request.groupSlug}` : "Group-only";
    }

    if (request.visibility === "private") {
      return "Private";
    }

    return "Public";
  }

  return (
    <main className="minimal-shell">
      <section className="minimal-grid">
        <div className="minimal-section-heading">
          <div className="minimal-hero">
            <p className="eyebrow">Prayer requests</p>
            <h1>Choose how each prayer request should be shared.</h1>
            <p>
              Keep requests private, share them with a group, or make them
              public for the wider community prayer feed.
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
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="minimal-input"
                  required
                />
              </div>
              <div>
                <label className="minimal-label">Description</label>
                <textarea
                  placeholder="Describe your prayer request"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="minimal-textarea"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="minimal-label">Sharing</label>
                <select
                  value={formData.visibility}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      visibility: e.target.value as PrayerRequestVisibility,
                    })
                  }
                  className="minimal-select"
                >
                  <option value="private">Private</option>
                  <option value="group">Group-only</option>
                  <option value="public">Public</option>
                </select>
              </div>
              {formData.visibility === "group" ? (
                <div>
                  <label className="minimal-label">Group</label>
                  <select
                    value={formData.groupSlug}
                    onChange={(e) => setFormData({ ...formData, groupSlug: e.target.value })}
                    className="minimal-select"
                    required
                  >
                    <option value="">Choose a group</option>
                    {groups.map((group) => (
                      <option key={group.slug} value={group.slug}>
                        {group.title}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
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

        {signedIn ? (
          <section className="minimal-card">
            <h2>Your requests</h2>
            {myRequests.length === 0 ? (
              <p>No personal prayer requests yet.</p>
            ) : (
              <div className="minimal-list">
                {myRequests.map((request) => (
                  <article key={request.id} className="minimal-item">
                    <div>
                      <h3>{request.title}</h3>
                      <p>{request.description}</p>
                      <div className="minimal-meta">
                        <span>{visibilityLabel(request)}</span>
                        <span>{request.status ?? "active"}</span>
                        <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {request.status !== "answered" ? (
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => void markAnswered(request)}
                      >
                        Mark answered
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => convertToTestimony(request)}
                      >
                        Turn into testimony
                      </button>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {loading ? (
          <p>Loading prayer requests...</p>
        ) : publicRequests.length === 0 ? (
          <section className="minimal-card minimal-empty">
            <HeartHandshake className="mx-auto mb-4 h-10 w-10 text-[var(--accent-strong)]" />
            <h2>No public prayer requests yet</h2>
            <p>The first shared request can set the tone for the whole page.</p>
          </section>
        ) : (
          <section className="minimal-list">
            {publicRequests.map((request) => (
              <article key={request.id} className="minimal-item">
                <div>
                  <h3>{request.title}</h3>
                  <p>{request.description}</p>
                  <div className="minimal-meta">
                    <span>By {request.user?.name || request.user?.email}</span>
                    <span>{request.prayerCount ?? 0} people praying</span>
                    <span>{new Date(request.createdAt).toLocaleDateString()}</span>
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
